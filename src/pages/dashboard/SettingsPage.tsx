import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { SubscriptionOverviewCard } from '@/components/business/SubscriptionOverviewCard';
import { KeyRound, User, Mail, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setProfileStatus({ type: 'error', text: 'Email address cannot be empty.' });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await authService.updateProfile({
        full_name: trimmedName,
        email: trimmedEmail,
      });
      await refreshUser();
      setProfileStatus({ type: 'success', text: 'Account profile updated successfully!' });
    } catch (err: unknown) {
      setProfileStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update account profile.',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#FDFBF7] tracking-tight">Account & Subscription</h1>
        <p className="text-xs text-[#BFA08A] mt-0.5">
          View your assigned plan limits, usage, credentials, and authentication details.
        </p>
      </div>

      {/* Subscription Card */}
      <SubscriptionOverviewCard />

      {/* Account Info & Profile Management Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Update your personal name and login email address</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            {profileStatus && (
              <Alert type={profileStatus.type} message={profileStatus.text} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                leftAddon={<User className="w-4 h-4" />}
                helperText="Display name on your account"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                leftAddon={<Mail className="w-4 h-4" />}
                helperText="Account login and administrative email"
              />
            </div>

            <div className="flex items-center gap-2.5 p-3.5 bg-[#1B120B] rounded-xl border border-[#3D2B1F] text-xs shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span className="text-[#BFA08A] font-medium">
                Account Role:{' '}
                <strong className="text-[#FDFBF7] capitalize font-bold">
                  {user?.role?.replace('_', ' ') || 'Business Owner'}
                </strong>
              </span>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdatingProfile}
            >
              Save Account Details
            </Button>
          </CardFooter>
        </form>
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

