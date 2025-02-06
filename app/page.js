'use client';

import { useState, useEffect } from 'react';
import Todo from '@/components/Todo';
import AuthForm from '@/components/AuthForm';


export default function Home() {
  const [access_token, setAccessToken] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  return (
    <>

      {access_token ? (
        <Todo onLogout={() => setAccessToken(null)} />

      ) : (
        <div className="flex-grow flex items-center justify-center">
          <AuthForm onAuthSuccess={setAccessToken} />
        </div>
      )}
    </>
  );
}