import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(cleanEmail, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Manage your permanent business URL, active links, and analytics."
      activeTab="login"
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6 p-6 sm:p-7">
          {error && <Alert type="error" message={error} />}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftAddon={<Mail className="w-4 h-4 text-[#94A3B8]" />}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#38BDF8] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftAddon={<Lock className="w-4 h-4 text-[#94A3B8]" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 font-bold py-3 text-sm shadow-xs"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-xs text-[#94A3B8] py-4 bg-[#0B1728] border-t border-[#20344D]">
          Don't have an account?{' '}
          <Link to="/signup" className="ml-1.5 font-bold text-[#38BDF8] hover:underline">
            Create an account
          </Link>
        </CardFooter>
      </form>
    </AuthLayout>
  );
};
