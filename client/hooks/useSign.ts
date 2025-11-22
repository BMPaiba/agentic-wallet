import { useState, useCallback } from 'react';

interface SignResponse {
  success: boolean;
  data?: {
    message: string;
    signature: string;
  };
  error?: string;
}

interface UseSignReturn {
  signMessage: (userId: string, message: string) => Promise<SignResponse>;
  isLoading: boolean;
  error: string | null;
  data: SignResponse['data'] | null;
}

/**
 * Hook para firmar un mensaje con el server wallet
 * Hace POST a /api/wallet/{userId}/sign
 * 
 * @returns {UseSignReturn} - Funciones y estados para firmar mensajes
 */
export const useSign = (): UseSignReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SignResponse['data'] | null>(null);

  const signMessage = useCallback(
    async (userId: string, message: string): Promise<SignResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validar que el userId sea un UUID válido
        if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
          throw new Error('Invalid userId format. Must be a valid UUID');
        }

        // Validar que el mensaje no esté vacío
        if (!message || message.trim().length === 0) {
          throw new Error('Message cannot be empty');
        }

        const response = await fetch(`https://agentic-wallet.onrender.com/api/wallet/${userId}/sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
          }),
        });

        const result: SignResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        setData(result.data || null);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
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
    signMessage,
    isLoading,
    error,
    data,
  };
};
