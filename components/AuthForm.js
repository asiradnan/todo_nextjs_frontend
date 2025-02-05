'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        if (!formData.email) {
          toast.error('Email is required for password reset');
          return;
        }
        await axios.post("https://todofastapi.asiradnan.com/get_password_reset_token", {
          email: formData.email
        });
        toast.success('Password reset instructions sent to your email!');
        setIsForgotPassword(false);
        return;
      }

      const params = new URLSearchParams();
      Object.keys(formData).forEach(key => {
        params.append(key, formData[key]);
      });

      if (isLogin) {
        const response = await axios.post("https://todofastapi.asiradnan.com/token", params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        onAuthSuccess(response.data.access_token);
        toast.success('Logged in successfully!')
      } else {
        if (formData.email === '') formData.email = null
        await axios.post("https://todofastapi.asiradnan.com/create_account", formData);
        toast.success('Account created successfully!')
        setIsLogin(true)
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    }
  };

  if (isForgotPassword) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => setIsForgotPassword(false)}
          >
            Back to Login
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:w-96">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        {!isLogin && (
          <Input
            type="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        )}
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <Button type="submit" className="w-full">
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        {isLogin && (
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsForgotPassword(true)}
          >
            Forgot Password?
          </Button>
        )}
      </form>
      <p className="text-center mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </Card>
  );
}
