// src/components/ApiTest.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';

const API_URL = 'http://localhost:8080'; // Your backend server URL

export const ApiTest = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [message, setMessage] = useState('');

  const callProtectedApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.get(`${API_URL}/api/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      setMessage(`API Call Failed: ${error.message}`);
    }
  };

  return (
    <div className="mt-8 p-4 border rounded-lg w-full max-w-2xl text-left">
      <h3 className="text-lg font-semibold mb-2">API Test</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click the button below to make an authenticated call to your backend's protected endpoint.
      </p>
      <Button onClick={callProtectedApi}>Call Protected API</Button>
      {message && (
        <pre className="mt-4 p-4 bg-slate-900 rounded-md text-white text-sm whitespace-pre-wrap break-all">
          <code>{message}</code>
        </pre>
      )}
    </div>
  );
};