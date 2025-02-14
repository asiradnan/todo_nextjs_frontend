"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInputError, setIsInputError] = useState(false);

    const router = useRouter();
    const handleBack = () => {
        router.push('/');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (email == '') {
                setIsInputError(true);
                toast.error('Email is required for password reset');
                return;
            }
            setIsLoading(true);
            setIsInputError(false);
            await axios.post("https://todofastapi.asiradnan.com/get_password_reset_token", {
                email
            });
            toast.success('Password reset instructions sent to your email!');
            return;
        }
        catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to send email.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex-grow flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto p-6 sm:w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setIsInputError(false);
                        }}
                        className={`flex-1 ${isInputError ? 'ring-red-500 ring-1' : ''}`}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleBack()}
                        disabled={isLoading}
                    >
                        Back to Login
                    </Button>
                </form>
            </Card>
        </div>
    )
}