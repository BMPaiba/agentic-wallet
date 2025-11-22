import { useState, useCallback } from 'react';

interface Wallet {
  userId: string;
  embeddedWalletAddress: string;
  serverWalletAddress: string;
  agentAuthorized: boolean;
}

interface GetWalletsByAddressResponse {
  success: boolean;
  data?: {
    address: string;
    wallets: Wallet[];
  };
  error?: string;
}

interface UseGetWalletsByAddressReturn {
  getWalletsByAddress: (address: string) => Promise<GetWalletsByAddressResponse>;
  isLoading: boolean;
  error: string | null;
  data: GetWalletsByAddressResponse['data'] | null;
}

/**
 * Hook para obtener las wallets asociadas a una dirección Ethereum
 * Hace GET a /api/wallet/by-address/{address}
 * 
 * @returns {UseGetWalletsByAddressReturn} - Funciones y estados
 */
export const useGetWalletsByAddress = (): UseGetWalletsByAddressReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetWalletsByAddressResponse['data'] | null>(null);

  const getWalletsByAddress = useCallback(
    async (address: string): Promise<GetWalletsByAddressResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validar dirección Ethereum
        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
          throw new Error('Invalid Ethereum address format');
        }

        const response = await fetch(`https://agentic-wallet.onrender.com/api/wallet/by-address/${address}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: GetWalletsByAddressResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        setData(result.data || null);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get wallets';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    getWalletsByAddress,
    isLoading,
    error,
    data,
  };
};
