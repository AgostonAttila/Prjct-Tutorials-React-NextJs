'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { AlertCircle, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ConnectionStatus() {
  const { isConnected, setConnectionStatus } = useStore();

  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine);
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, [setConnectionStatus]);

  if (isConnected) return null;

  return (
    <Alert variant="destructive" className="my-4 mx-auto w-max">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center">
        <Wifi className="h-4 w-4 mr-2" />
        Connection lost. Attempting to reconnect...
      </AlertDescription>
    </Alert>
  );
}
