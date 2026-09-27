import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#140D08] flex flex-col items-center justify-center p-6 text-center selection:bg-[#2E1F15] selection:text-[#D49B5B]">
      <div className="w-full max-w-md bg-[#241810] p-8 sm:p-10 rounded-3xl border border-[#3D2B1F] shadow-xl flex flex-col items-center">
        <div className="text-6xl font-black text-[#D49B5B] mb-2 tracking-tight">
          404
        </div>
        <h1 className="text-xl font-bold text-[#FDFBF7] tracking-tight">Page Not Found</h1>
        <p className="mt-2 text-sm text-[#BFA08A] max-w-sm leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6">
          <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

