import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Link as LinkIcon, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Please provide your full name.');
      return;
    }
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await signup(cleanEmail, password, cleanName, 'business_owner');
      navigate('/dashboard/profile', { replace: true });
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      if (rawMsg.toLowerCase().includes('rate limit')) {
        setError("Supabase email rate limit exceeded (free built-in limit is 3-4 emails/hr). Please turn OFF 'Confirm email' in Supabase Dashboard → Authentication → Providers → Email to create accounts instantly without email restrictions.");
      } else {
        setError(rawMsg);
      }
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
        <h2 className="text-xl font-bold text-slate-900">Create your business account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Get your single permanent public URL and dynamic link builder.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && <Alert type="error" message={error} />}

              <Input
                label="Full Name"
                placeholder="Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                leftAddon={<User className="w-4 h-4" />}
              />

              <Input
                label="Work Email Address"
                type="email"
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftAddon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Create Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftAddon={<Lock className="w-4 h-4" />}
                helperText="Must contain at least 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
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
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Set Up URL
              </Button>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 py-4 bg-slate-50/50">
              Already have an account?{' '}
              <Link to="/login" className="ml-1 font-semibold text-sky-600 hover:text-sky-700 hover:underline">
                Sign in
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
