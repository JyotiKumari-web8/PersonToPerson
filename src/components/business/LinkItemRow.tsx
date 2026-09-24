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
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border transition-all ${
        link.is_active
          ? 'border-slate-200/90 hover:border-sky-300 hover:shadow-xs'
          : 'border-slate-200/60 bg-slate-50/50 opacity-75'
      }`}
    >
      {/* Left side: Reorder + Icon + Label & URL */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Reorder Buttons */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move link up"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move link down"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Link Type Icon */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${cfg.badgeBg}`}>
          {cfg.icon({ className: 'w-4 h-4' })}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{link.label}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
              {cfg.label}
            </span>
            {!link.is_active && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Hidden
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
              {link.url}
            </span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Test destination URL"
              className="text-slate-400 hover:text-sky-600 transition-colors shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Right side: Actions & Status Switch */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 select-none">
            {link.is_active ? 'Active' : 'Inactive'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={link.is_active}
            disabled={isToggling}
            onClick={handleToggle}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 ${
              link.is_active ? 'bg-sky-600' : 'bg-slate-300'
            }`}
          >
            {isToggling ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              </span>
            ) : (
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  link.is_active ? 'translate-x-4' : 'translate-x-0'
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
            className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
              <span className="text-[11px] font-medium text-rose-700 px-1">Delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                {isDeleting ? '...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="text-[11px] font-medium text-slate-600 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              title="Delete link"
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
