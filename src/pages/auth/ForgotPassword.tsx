import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Card, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Link as LinkIcon, Mail, ArrowLeft, Send } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
            <LinkIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">PersonToPerson</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Reset your password</h2>
        <p className="mt-1 text-xs text-slate-500">
          We will send password reset instructions to your email address.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-sm">
          {success ? (
            <CardContent className="pt-6 text-center space-y-4">
              <Alert
                type="success"
                title="Email Sent"
                message={`If an account exists for ${email}, a password reset link has been dispatched. Please check your inbox and spam folder.`}
              />
              <Link to="/login">
                <Button variant="primary" className="w-full mt-4">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                {error && <Alert type="error" message={error} />}

                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftAddon={<Mail className="w-4 h-4" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={isLoading}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send Reset Link
                </Button>
              </CardContent>

              <CardFooter className="justify-center text-xs text-slate-500 py-4 bg-slate-50/50">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
