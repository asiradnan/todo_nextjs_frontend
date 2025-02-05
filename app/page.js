'use client';

import { useState, useEffect } from 'react';
import Todo from '@/components/Todo';
import AuthForm from '@/components/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [access_token, setAccessToken] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  return (
    <div className="container mx-auto py-4 px-4 min-h-screen justify-start flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Todo App</h1>
        <ThemeToggle />
      </div>
      
        {access_token ? (
          <Todo onLogout={() => setAccessToken(null)} />
          
        ) : (
          <div className="flex-grow flex items-center justify-center">
          <AuthForm onAuthSuccess={setAccessToken} />
          </div>
        )}
      
    </div>
  );
}