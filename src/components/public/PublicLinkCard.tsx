import React, { useState } from 'react';
import { BusinessLink } from '@/types';
import { LINK_TYPE_CONFIG } from '@/components/business/linkIcons';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface PublicLinkCardProps {
  link: BusinessLink;
  onLinkClick: (linkId: string, url: string) => void;
}

export const PublicLinkCard: React.FC<PublicLinkCardProps> = ({
  link,
  onLinkClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const cfg = LINK_TYPE_CONFIG[link.link_type] || LINK_TYPE_CONFIG.custom;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLinkClick(link.id, link.url);
  };

  return (
    <a
      href={link.url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`group relative flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isPressed
          ? 'scale-[0.98] bg-sky-50/70 border-sky-300'
          : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-sky-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${cfg.badgeBg}`}
        >
          {cfg.icon({ className: `w-5 h-5 ${cfg.colorClass}` })}
        </div>
        <div className="min-w-0 text-left">
          <span className="block text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
            {link.label}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">
            {cfg.label}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-slate-400 group-hover:text-sky-600 group-hover:bg-sky-50 transition-all">
        {link.link_type === 'whatsapp' || link.link_type === 'payment' ? (
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        ) : (
          <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110" />
        )}
      </div>
    </a>
  );
};
