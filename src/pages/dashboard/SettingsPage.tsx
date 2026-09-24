import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { KeyRound, User, Mail, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await authService.updatePassword(newPassword);
      setPasswordStatus({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPasswordStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update password.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your account credentials, security preferences, and authentication details.
        </p>
      </div>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your registered account details</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              leftAddon={<Mail className="w-4 h-4" />}
              helperText="Managed by authentication provider"
            />
            <Input
              label="Full Name"
              value={user?.full_name || 'Business Owner'}
              disabled
              leftAddon={<User className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">
              Account Role:{' '}
              <strong className="text-slate-800 capitalize">
                {user?.role?.replace('_', ' ') || 'Business Owner'}
              </strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your secure account password</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            {passwordStatus && (
              <Alert type={passwordStatus.type} message={passwordStatus.text} />
            )}

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              leftAddon={<KeyRound className="w-4 h-4" />}
              helperText="Must be at least 6 characters"
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftAddon={<KeyRound className="w-4 h-4" />}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdatingPassword}
            >
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
