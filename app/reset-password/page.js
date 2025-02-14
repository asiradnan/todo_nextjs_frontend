'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ThemeToggle from '@/components/ThemeToggle';

const API_BASE_URL = 'https://todofastapi.asiradnan.com';


function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const token = searchParams.get('password_reset_token');
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset_password`, {
        token: token,
        new_password: passwords.password
      });
      toast.success('Password reset successful');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              className="pl-10"
              required
            />
            <KeyRound className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="pl-10"
              required
            />
            <KeyRound className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          Reset Password
        </Button>
      </form>
    </Card>
  );
}



export default function ResetPassword() {
  return (

      <div className="flex-grow flex items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
  );
}
