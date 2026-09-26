import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { CardContent } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter a secure password for your account."
      activeTab="reset"
    >
      <CardContent className="pt-6 p-6 sm:p-7">
        {success ? (
          <div className="text-center space-y-3 py-4">
            <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto" />
            <h3 className="text-base font-bold text-[#F8FAFC]">Password Updated!</h3>
            <p className="text-xs text-[#94A3B8]">
              Your password has been changed. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error" message={error} />}

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftAddon={<Lock className="w-4 h-4 text-[#94A3B8]" />}
              helperText="Must be at least 6 characters"
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftAddon={<Lock className="w-4 h-4 text-[#94A3B8]" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-bold py-3 text-sm shadow-xs"
              isLoading={isLoading}
            >
              Save New Password
            </Button>
          </form>
        )}
      </CardContent>
    </AuthLayout>
  );
};
