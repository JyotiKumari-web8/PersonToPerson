import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl font-extrabold text-slate-300 mb-2">404</div>
      <h1 className="text-xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-xs text-slate-500 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="sm" icon={<Home className="w-4 h-4" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
