import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-center p-6 text-center selection:bg-[#0EA5E9]/20 selection:text-[#38BDF8]">
      <div className="w-full max-w-md bg-[#101D30] p-8 sm:p-10 rounded-3xl border border-[#20344D] shadow-xl flex flex-col items-center">
        <div className="text-6xl font-black text-[#38BDF8] mb-2 tracking-tight">
          404
        </div>
        <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Page Not Found</h1>
        <p className="mt-2 text-sm text-[#94A3B8] max-w-sm leading-relaxed">
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

