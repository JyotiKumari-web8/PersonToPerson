import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

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
    <AuthLayout
      title="Create your business account"
      subtitle="Get your single permanent public URL and dynamic link builder."
      activeTab="signup"
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6 p-6 sm:p-7">
          {error && <Alert type="error" message={error} />}

          <Input
            label="Full Name"
            placeholder="Your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            leftAddon={<User className="w-4 h-4 text-[#94A3B8]" />}
          />

          <Input
            label="Work Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftAddon={<Mail className="w-4 h-4 text-[#94A3B8]" />}
          />

          <Input
            label="Create Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftAddon={<Lock className="w-4 h-4 text-[#94A3B8]" />}
            helperText="Must contain at least 6 characters"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
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
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Set Up URL
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-xs text-[#94A3B8] py-4 bg-[#0B1728] border-t border-[#20344D]">
          Already have an account?{' '}
          <Link to="/login" className="ml-1.5 font-bold text-[#38BDF8] hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </form>
    </AuthLayout>
  );
};
