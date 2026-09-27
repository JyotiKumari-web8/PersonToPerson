import React, { useState, useRef, useEffect } from 'react';
import { storageService } from '@/services/storageService';
import {
  UploadCloud,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
  Link2,
} from 'lucide-react';

interface SponsorImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const SponsorImageUploader: React.FC<SponsorImageUploaderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageError(false);
  }, [value]);

  const handleFileChange = async (file: File) => {
    setUploadError(null);
    setImageError(false);

    // 1. Client-side file validation
    const validation = storageService.validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file format.');
      return;
    }

    // 2. Upload to storage
    try {
      setIsUploading(true);
      const publicUrl = await storageService.uploadSponsorLogo(file);
      onChange(publicUrl);
    } catch (err: unknown) {
      console.error('Sponsor logo upload failed:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Failed to upload image. Please try again or check the file size.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    onChange('');
    setUploadError(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#DDD3CA] uppercase tracking-wider">
          Upload Sponsor Logo
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#9E8E81] hover:text-[#D49B5B] transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Or paste image URL'}</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload State / Empty State */}
      {!value && !isUploading && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#D49B5B] bg-[#2E1F15] ring-2 ring-[#D49B5B]/30'
              : 'border-[#3D2B1F] hover:border-[#D49B5B]/60 bg-[#1B120B] hover:bg-[#2E1F15]/40'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#2E1F15] text-[#D49B5B] flex items-center justify-center mx-auto mb-2.5 border border-[#3D2B1F] shadow-xs">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[#FBF9F5]">
            Choose a sponsor logo <span className="font-normal text-[#9E8E81]">or drag & drop</span>
          </p>
          <p className="text-[11px] text-[#9E8E81] mt-1">
            PNG, JPG, WebP, GIF, or SVG (max 5 MB)
          </p>
        </div>
      )}

      {/* Uploading progress spinner */}
      {isUploading && (
        <div className="border border-[#3D2B1F] rounded-2xl p-6 text-center bg-[#2E1F15]/50 flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#D49B5B] mb-2" />
          <p className="text-xs font-semibold text-[#FBF9F5]">Uploading Sponsor Logo...</p>
          <p className="text-[11px] text-[#9E8E81] mt-0.5">Validating and storing image</p>
        </div>
      )}

      {/* Clean Preview for Uploaded Sponsor Logo */}
      {value && !isUploading && (
        <div className="p-3.5 rounded-2xl border border-[#3D2B1F] bg-[#1B120B] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Logo Preview Box */}
            <div className="w-14 h-14 rounded-xl bg-[#2E1F15] border border-[#3D2B1F] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {imageError ? (
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-rose-400 bg-rose-950/40 rounded-lg"
                  title="Image failed to load"
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
              ) : (
                <img
                  src={value}
                  alt="Sponsor Logo Preview"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Info and Status */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FBF9F5] truncate block">
                  Sponsor Logo
                </span>
                {!imageError ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3" />
                    Logo Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/40 text-rose-300 border border-rose-800/60">
                    Broken Image
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9E8E81] truncate max-w-[200px] sm:max-w-xs mt-0.5">
                {value.startsWith('data:') ? 'Inline Image Data' : value}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#DDD3CA] hover:text-[#D49B5B] hover:bg-[#2E1F15] rounded-xl border border-[#3D2B1F] transition-colors cursor-pointer"
              title="Replace image with another file"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="p-1.5 text-[#9E8E81] hover:text-[#EF4444] hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="Remove logo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="p-3 rounded-xl border border-[#3D2B1F] bg-[#2E1F15]/50 space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#DDD3CA]">
            Direct Image URL (External CDN / S3 / Cloudinary)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={value.startsWith('data:') ? '' : value}
              onChange={(e) => {
                onChange(e.target.value.trim());
                setImageError(false);
                setUploadError(null);
              }}
              placeholder="https://example.com/logo.png"
              className="w-full rounded-xl border border-[#3D2B1F] bg-[#1B120B] px-3.5 py-2 text-xs text-[#FBF9F5] placeholder:text-[#9E8E81] focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/20 focus:border-[#D49B5B]"
            />
          </div>
        </div>
      )}

      {/* Clear error alert */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload failed</p>
            <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">{uploadError}</p>
          </div>
        </div>
      )}
    </div>
  );
};
