# Agentic Wallet - Backend Setup Guide

## 🎯 Backend Overview

El backend proporciona los siguientes servicios:

### **Server Wallet (Agent Wallet)**
- Crea wallets automáticas para cada usuario usando Coinbase CDP SDK
- Gestiona las wallets del agente que ejecutarán transacciones
- Firma transacciones en nombre del usuario (después de autorización)

### **API Endpoints**

```
POST   /api/wallet/create          - Crear server wallet para usuario
GET    /api/wallet/:userId         - Obtener info de wallet
GET    /api/wallet/:userId/balances - Obtener balances de tokens
POST   /api/wallet/authorize       - Autorizar al agente
POST   /api/wallet/:userId/sign    - Firmar mensaje (testing)
```

---

## 📋 Prerequisitos

### 1. **Obtener Credenciales de Coinbase Developer Platform**

1. Ve a: https://portal.cdp.coinbase.com/
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Genera API Keys:
   - Te darán un `API Key Name` (formato: `organizations/{org_id}/apiKeys/{key_id}`)
   - Te darán un `Private Key` (formato PEM)

### 2. **Configurar Variables de Entorno**

Crea un archivo `.env` en `server/`:

```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales:

```env
# Coinbase Developer Platform
CDP_API_KEY_NAME=organizations/YOUR_ORG_ID/apiKeys/YOUR_KEY_ID
CDP_PRIVATE_KEY=-----BEGIN EC PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END EC PRIVATE KEY-----

# Resto de configuración...
```

---

## 🚀 Instalación

```bash
cd server
npm install
```

---

## 🏃 Ejecutar el Servidor

### Modo Desarrollo (con hot reload)
```bash
npm run dev
```

### Modo Producción
```bash
npm run build
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📡 Uso de la API

### 1. **Crear Server Wallet**

Cuando el usuario crea su Embedded Wallet en el frontend, debes crear su Server Wallet correspondiente:

```bash
POST http://localhost:3000/api/wallet/create
Content-Type: application/json

{
  "userId": "user123",
  "userAddress": "0xUSER_ADDRESS_FROM_EMBEDDED_WALLET"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "embeddedWalletAddress": "0xUSER...",
    "serverWalletAddress": "0xAGENT...",
    "agentAuthorized": false
  }
}
```

### 2. **Obtener Info de Wallet**

```bash
GET http://localhost:3000/api/wallet/user123
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "serverWalletAddress": "0xAGENT..."
  }
}
```

### 3. **Autorizar Agente**

El usuario debe autorizar al agente para ejecutar transacciones:

```bash
POST http://localhost:3000/api/wallet/authorize
Content-Type: application/json

{
  "userId": "user123",
  "userAddress": "0xUSER...",
  "signature": "0xSIGNATURE_FROM_USER"
}
```

---

## 🔑 Flujo de Integración con Frontend

```
1. Frontend: Usuario crea Embedded Wallet
   └─> Obtiene userAddress (0xUSER...)

2. Frontend → Backend: POST /api/wallet/create
   └─> Backend crea Server Wallet (0xAGENT...)
   └─> Retorna serverWalletAddress

3. Frontend: Usuario firma mensaje autorizando agente
   └─> Genera signature

4. Frontend → Backend: POST /api/wallet/authorize
   └─> Backend registra autorización

5. Backend: Ahora puede firmar transacciones en nombre del usuario
```

---

## 🛠️ Arquitectura del Código

```
server/src/
├── config/
│   └── env.config.ts           # Configuración de environment
├── controllers/
│   └── wallet.controller.ts    # Lógica de endpoints de wallet
├── services/
│   └── wallet.service.ts       # Servicio de Coinbase CDP SDK
├── routes/
│   ├── index.ts                # Routes principales
│   └── wallet.routes.ts        # Routes de wallet
├── types/
│   ├── wallet.types.ts         # Tipos de wallet
│   └── env.types.ts            # Tipos de environment
└── server.ts                   # Entry point
```

---

## 🧪 Testing

Puedes probar los endpoints usando curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Crear wallet
curl -X POST http://localhost:3000/api/wallet/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","userAddress":"0x1234567890123456789012345678901234567890"}'

# Obtener wallet
curl http://localhost:3000/api/wallet/test123
```

---

## 📝 Próximos Pasos

1. ✅ Backend con Server Wallet listo
2. ⏭️ Crear frontend con Embedded Wallet
3. ⏭️ Integrar MATE Treasury
4. ⏭️ Integrar Fisher (gasless)
5. ⏭️ Implementar payment scheduler

---

## ⚠️ Notas Importantes

- **Seguridad**: Las Private Keys del CDP nunca deben exponerse al frontend
- **Storage**: En producción, las wallets deben persistirse en una base de datos
- **Network**: Actualmente configurado para Base Sepolia (testnet)
- **Testing**: Necesitas ETH de testnet para crear transacciones

---

## 🆘 Troubleshooting

### Error: "CDP credentials not configured"
- Verifica que `.env` tenga `CDP_API_KEY_NAME` y `CDP_PRIVATE_KEY`
- Asegúrate que la private key tenga los saltos de línea correctos

### Error: "Wallet not found"
- Primero debes crear la wallet con POST `/api/wallet/create`
- Verifica que el userId sea el correcto

### Error de conexión
- Verifica que el servidor esté corriendo en el puerto correcto
- Revisa los logs del servidor para más detalles
