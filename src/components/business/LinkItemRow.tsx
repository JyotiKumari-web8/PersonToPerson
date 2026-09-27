import React, { useState } from 'react';
import { BusinessLink } from '@/types';
import { LINK_TYPE_CONFIG } from './linkIcons';
import { ArrowUp, ArrowDown, ExternalLink, Pencil, Trash2, Loader2 } from 'lucide-react';

interface LinkItemRowProps {
  link: BusinessLink;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onToggleActive: (active: boolean) => Promise<void>;
}

export const LinkItemRow: React.FC<LinkItemRowProps> = ({
  link,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const cfg = LINK_TYPE_CONFIG[link.link_type] || LINK_TYPE_CONFIG.custom;

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggleActive(!link.is_active);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-2xl border transition-all duration-150 ${
        link.is_active
          ? 'bg-[#241810] border-[#3D2B1F] hover:border-[#D49B5B]/50 shadow-sm hover:shadow-md'
          : 'bg-[#1B120B] border-[#3D2B1F]/60 opacity-75'
      }`}
    >
      {/* Left side: Reorder + Icon + Label & URL */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Reorder Buttons */}
        <div className="flex flex-col gap-0.5 shrink-0 bg-[#1B120B] p-0.5 rounded-lg border border-[#3D2B1F]">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move link up"
            className="p-1 rounded-md text-[#9E8E81] hover:text-[#D49B5B] hover:bg-[#2E1F15] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move link down"
            className="p-1 rounded-md text-[#9E8E81] hover:text-[#D49B5B] hover:bg-[#2E1F15] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Link Type Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cfg.badgeBg} shadow-xs`}>
          {cfg.icon({ className: 'w-4.5 h-4.5' })}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-[#FBF9F5] truncate tracking-tight">{link.label}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]">
              {cfg.label}
            </span>
            {!link.is_active && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-300 border border-amber-800/60">
                Hidden
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-[#9E8E81] font-mono truncate max-w-xs sm:max-w-md">
              {link.url}
            </span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Test destination URL"
              className="text-[#9E8E81] hover:text-[#D49B5B] transition-colors shrink-0 p-0.5 rounded hover:bg-[#2E1F15]"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Right side: Actions & Status Switch */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#3D2B1F] shrink-0">
        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#DDD3CA] select-none">
            {link.is_active ? 'Active' : 'Inactive'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={link.is_active}
            disabled={isToggling}
            onClick={handleToggle}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/40 disabled:opacity-50 ${
              link.is_active ? 'bg-[#D49B5B]' : 'bg-[#2E1F15] border border-[#3D2B1F]'
            }`}
          >
            {isToggling ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-[#140D08] animate-spin" />
              </span>
            ) : (
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  link.is_active ? 'translate-x-4 bg-[#140D08]' : 'translate-x-0 bg-[#9E8E81]'
                }`}
              />
            )}
          </button>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            title="Edit link"
            className="p-2 text-[#9E8E81] hover:text-[#D49B5B] hover:bg-[#2E1F15] rounded-xl transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {showConfirmDelete ? (
            <div className="flex items-center gap-1.5 bg-rose-950/60 p-1.5 rounded-xl border border-rose-800/80 shadow-xs">
              <span className="text-[11px] font-semibold text-rose-200 px-1">Delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-[11px] font-bold text-white bg-[#EF4444] hover:bg-rose-600 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                {isDeleting ? '...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="text-[11px] font-medium text-[#9E8E81] hover:bg-[#2E1F15] hover:text-[#FBF9F5] px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              title="Delete link"
              className="p-2 text-[#9E8E81] hover:text-[#EF4444] hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
