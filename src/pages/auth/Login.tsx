import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Link as LinkIcon, Mail, Lock, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
            <LinkIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">PersonToPerson</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Sign in to your dashboard</h2>
        <p className="mt-1 text-xs text-slate-500">
          Manage your permanent business URL, active links, and analytics.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && <Alert type="error" message={error} />}

              <Input
                label="Email Address"
                type="email"
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftAddon={<Mail className="w-4 h-4" />}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
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
                  leftAddon={<Lock className="w-4 h-4" />}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 py-4 bg-slate-50/50">
              Don't have an account?{' '}
              <Link to="/signup" className="ml-1 font-semibold text-sky-600 hover:text-sky-700 hover:underline">
                Create an account
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
