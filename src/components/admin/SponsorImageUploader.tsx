import React, { useState, useRef, useEffect } from 'react';
import { storageService } from '@/services/storageService';
import {
  UploadCloud,
  Link2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
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
  // Determine initial method based on value
  const [method, setMethod] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If value changes externally or has value on mount, reset imageError
  useEffect(() => {
    setImageError(false);
  }, [value]);

  const handleFileChange = async (file: File) => {
    setUploadError(null);
    setImageError(false);

    const validation = storageService.validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      return;
    }

    try {
      setIsUploading(true);
      setFileName(file.name);
      const publicUrl = await storageService.uploadSponsorLogo(file);
      onChange(publicUrl);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
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
    setFileName(null);
    setUploadError(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Label and Method Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label className="block text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider">
          Sponsor Logo / Image
        </label>

        {/* Method Toggle Buttons */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-[#0B1728] border border-[#20344D] text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setMethod('upload');
              setUploadError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              method === 'upload'
                ? 'bg-[#14243A] text-[#38BDF8] font-bold shadow-xs border border-[#20344D]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('url');
              setUploadError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              method === 'url'
                ? 'bg-[#14243A] text-[#38BDF8] font-bold shadow-xs border border-[#20344D]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Use Image URL</span>
          </button>
        </div>
      </div>

      {/* METHOD 1: Upload from Computer */}
      {method === 'upload' && (
        <div className="space-y-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            disabled={disabled || isUploading}
          />

          {!value && !isUploading && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-[#38BDF8] bg-[#14243A] ring-2 ring-[#38BDF8]/20'
                  : 'border-[#20344D] hover:border-[#38BDF8]/50 bg-[#0B1728] hover:bg-[#14243A]/40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#14243A] text-[#38BDF8] flex items-center justify-center mx-auto mb-2 border border-[#20344D]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#F8FAFC]">
                Click to select image <span className="font-normal text-[#94A3B8]">or drag & drop</span>
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                PNG, JPG, WebP, GIF, or SVG (max 5 MB)
              </p>
            </div>
          )}

          {isUploading && (
            <div className="border border-[#20344D] rounded-2xl p-6 text-center bg-[#14243A]/50">
              <Loader2 className="w-6 h-6 animate-spin text-[#38BDF8] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#F8FAFC]">Uploading to Storage...</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">Please wait a moment</p>
            </div>
          )}

          {/* Upload error display with helpful guidance */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Upload failed</p>
                <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">{uploadError}</p>
                <button
                  type="button"
                  onClick={() => setMethod('url')}
                  className="mt-2 text-[11px] font-semibold text-[#38BDF8] underline cursor-pointer"
                >
                  Or switch to &quot;Use Image URL&quot; to link directly &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* METHOD 2: Direct Image URL */}
      {method === 'url' && (
        <div className="space-y-2">
          <div className="relative flex items-center rounded-xl shadow-xs">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#94A3B8]">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={value}
              onChange={(e) => {
                onChange(e.target.value.trim());
                setImageError(false);
              }}
              placeholder="https://images.domain.com/logo.png"
              disabled={disabled}
              className="w-full rounded-xl border border-[#20344D] bg-[#14243A] pl-10 pr-9 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all"
            />
            {value && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2.5 p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101D30] transition-colors"
                title="Clear URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#94A3B8] leading-normal">
            Paste a public direct link to an image file (hosted on your CDN, Cloudinary, AWS S3, etc.).
          </p>
        </div>
      )}

      {/* Image Preview & Management Card (Shown when value is set and not uploading) */}
      {value && !isUploading && (
        <div className="p-3 rounded-xl border border-[#20344D] bg-[#0B1728] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Image Preview Thumbnail */}
            <div className="w-12 h-12 rounded-lg bg-[#14243A] border border-[#20344D] p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              {imageError ? (
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-rose-400 bg-rose-950/40 rounded"
                  title="Image failed to load"
                >
                  <AlertCircle className="w-4 h-4" />
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

            {/* Logo Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#F8FAFC] truncate block">
                  {fileName || 'Sponsor Logo'}
                </span>
                {!imageError ? (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/60">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-950/40 text-rose-300 border border-rose-800/60">
                    Failed to load
                  </span>
                )}
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#38BDF8] hover:underline flex items-center gap-0.5 truncate max-w-[200px] sm:max-w-xs mt-0.5"
                title={value}
              >
                <span className="truncate">{value}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {method === 'upload' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-medium text-[#CBD5E1] hover:text-[#38BDF8] hover:bg-[#14243A] rounded-lg border border-[#20344D] shadow-xs transition-colors cursor-pointer"
                title="Choose another image file"
              >
                Change
              </button>
            )}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Remove logo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
