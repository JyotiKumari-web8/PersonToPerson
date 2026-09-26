import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide your registered email address.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword(cleanEmail);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We will send password reset instructions to your registered email address."
      activeTab="forgot"
    >
      {success ? (
        <CardContent className="pt-6 p-6 sm:p-7 text-center space-y-4">
          <Alert
            type="success"
            title="Email Sent"
            message={`If an account exists for ${email}, a password reset link has been dispatched. Please check your inbox and spam folder.`}
          />
          <Link to="/login">
            <Button variant="primary" className="w-full mt-4 font-bold py-3 text-sm shadow-xs">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6 p-6 sm:p-7">
            {error && <Alert type="error" message={error} />}

            <Input
              label="Registered Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftAddon={<Mail className="w-4 h-4 text-[#94A3B8]" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-bold py-3 text-sm shadow-xs"
              isLoading={isLoading}
              icon={<Send className="w-4 h-4" />}
            >
              Send Reset Link
            </Button>
          </CardContent>

          <CardFooter className="justify-center text-xs text-[#94A3B8] py-4 bg-[#0B1728] border-t border-[#20344D]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-[#38BDF8] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to login</span>
            </Link>
          </CardFooter>
        </form>
      )}
    </AuthLayout>
  );
};

