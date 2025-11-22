# Agentic Wallet Server 🚀

Backend servidor para pagos recurrentes gasless usando **EVVM MATE Protocol** y **Coinbase Developer Platform**.

## 🏗️ Arquitectura

```
server/
├── src/
│   ├── config/          # Configuración y variables de entorno
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware (auth, errors, logger)
│   ├── routes/          # Definición de rutas API
│   ├── services/        # Lógica de negocio
│   ├── types/           # TypeScript types & interfaces
│   └── server.ts        # Punto de entrada
├── .env.example         # Variables de entorno template
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🚀 Quick Start

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Iniciar servidor en desarrollo
```bash
npm run dev
```

### 4. Build para producción
```bash
npm run build
npm start
```

## 📡 Endpoints Disponibles

```
GET  /              - Root endpoint
GET  /api/health    - Health check
GET  /api/info      - API information
```

## 🔑 Variables de Entorno Requeridas

### Coinbase Developer Platform
- `CDP_API_KEY` - API Key de CDP
- `CDP_API_SECRET` - API Secret de CDP

### EVVM MATE Protocol
- `EVVM_APP_ID` - Application ID de EVVM
- `FISHER_API_URL` - URL del Fisher executor
- `MATE_TREASURY_ADDRESS` - Dirección del smart contract Treasury
- `MATE_TOKEN_ADDRESS` - Dirección del token MATE

### Blockchain
- `SEPOLIA_RPC_URL` - RPC endpoint de Sepolia testnet
- `CHAIN_ID` - Chain ID (11155111 para Sepolia)

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Blockchain**: EVVM MATE Protocol
- **Wallet**: Coinbase AgentKit + Embedded Wallet SDK
- **Database**: PostgreSQL (próximamente)

## 📝 Próximos Pasos

1. ✅ Configuración base del servidor
2. 🔄 Integrar Coinbase CDP (Embedded Wallet + Server Wallet)
3. 🔄 Integrar EVVM Fisher para transacciones gasless
4. 🔄 Implementar sistema de pagos recurrentes
5. 🔄 Agregar scheduler con node-cron
6. 🔄 Configurar PostgreSQL
7. 🔄 Implementar AI Agent con OpenAI

## 🔗 Links Útiles

- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [EVVM Telegram](https://t.me/EVVMorg)
- [EVVM MATE Protocol Docs](https://docs.evvm.io)

---

**Status**: ✅ Servidor base configurado y funcionando
