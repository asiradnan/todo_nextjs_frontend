'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, User, KeyRound, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ThemeToggle from '@/components/ThemeToggle';


const API_BASE_URL = 'https://todofastapi.asiradnan.com';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: ' ',
    verified: false
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  const handleApiError = async (error) => {
    if (error.response?.status === 401) {
      try {
        const response = await axios.post(`${API_BASE_URL}/refresh_token`,
          { refresh_token: localStorage.getItem('refresh_token') });
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
      } catch (refreshError) {
        router.push('/login');
      }
    }
    toast.error(error.response?.data?.detail || 'An error occurred');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, getAuthHeader());
      setUserData({
        username: response.data.username || '',
        email: response.data.email || '',
        verified: response.data.verified || false
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        `${API_BASE_URL}/update_user`,
        {
          username: userData.username,
          email: userData.email,
        },
        getAuthHeader()
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/change_password`,
        {
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword
        },
        getAuthHeader()
      );

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password updated successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmail = async () => {
    setSaving(true);
    try {
      await axios.get(
        `${API_BASE_URL}/remove_email`,
        getAuthHeader()
      );
      toast.success('Email removed successfully');
      fetchUserData()
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/get_verify_token`,
        {},
        getAuthHeader()
      );
      toast.success('Verification email sent');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 min-h-screen justify-start flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Todo App</h1>
        <ThemeToggle />
      </div>
      <div className="container mx-auto pb-4 px-4">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <div className="w-40">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Tasks
            </Button>
          </div>
          <h2 className="flex-1 text-2xl font-semibold text-center">Profile Settings</h2>
          <div className="w-40" />
        </div>
        <div className="space-y-8">
          {/* Profile Information */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    className="pl-10"
                  />
                  <User className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Email</Label>
                  {userData.email && (
                    <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${userData.verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {userData.verified ? '✓' : '!'}
                    </span>
                  )}
                </div>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="pl-10"
                      placeholder="No email address set"
                    />
                    <Mail className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleDeleteEmail}
                    disabled={!userData.email || saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendVerification}
                disabled={saving}
              >
                Send Verification Email
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>

          {/* Password Change */}
          <form onSubmit={handleUpdatePassword} className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="pl-10"
                  />
                  <KeyRound className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="pl-10"
                  />
                  <KeyRound className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="pl-10"
                  />
                  <KeyRound className="h-5 w-5 absolute left-3 top-2.5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              Update Password
            </Button>
          </form>
        </div>
      </Card>
      </div>
    </div>
  );
}