import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Card, CardContent } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Link as LinkIcon, Lock, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
            <LinkIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">PersonToPerson</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Set new password</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter a secure password for your account.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            {success ? (
              <div className="text-center space-y-3 py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Password Updated!</h3>
                <p className="text-xs text-slate-500">
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
                  leftAddon={<Lock className="w-4 h-4" />}
                  helperText="Must be at least 6 characters"
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  leftAddon={<Lock className="w-4 h-4" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Save New Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
