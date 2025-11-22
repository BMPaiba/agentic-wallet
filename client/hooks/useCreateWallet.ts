import { useState, useCallback } from 'react';

interface CreateWalletResponse {
  success: boolean;
  data?: {
    userId: string;
    embeddedWalletAddress: string;
    serverWalletAddress: string;
    agentAuthorized: boolean;
  };
  error?: string;
}

interface UseCreateWalletReturn {
  createWallet: (userId: string, userAddress: string) => Promise<CreateWalletResponse>;
  isLoading: boolean;
  error: string | null;
  data: CreateWalletResponse['data'] | null;
}

/**
 * Hook para crear un server wallet (agent wallet) en el servidor
 * 
 * @returns {UseCreateWalletReturn} - Funciones y estados para crear wallet
 */
export const useCreateWallet = (): UseCreateWalletReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CreateWalletResponse['data'] | null>(null);

  const createWallet = useCallback(
    async (userId: string, userAddress: string): Promise<CreateWalletResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validar que el userId sea un UUID válido
        if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
          throw new Error('Invalid userId format. Must be a valid UUID');
        }

        // Validar dirección Ethereum
        if (!userAddress || !/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
          throw new Error('Invalid Ethereum address format');
        }

        const response = await fetch('https://agentic-wallet.onrender.com/api/wallet/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            userAddress,
          }),
        });

        const result: CreateWalletResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        setData(result.data || null);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
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
    createWallet,
    isLoading,
    error,
    data,
  };
};
