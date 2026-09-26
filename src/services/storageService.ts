import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const BUCKET_NAME = 'sponsors';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const storageService = {
  /**
   * Validate image file format and file size
   */
  validateImageFile(file: File): FileValidationResult {
    if (!file) {
      return { valid: false, error: 'No image file was selected.' };
    }

    const isValidType =
      ALLOWED_MIME_TYPES.includes(file.type) ||
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);

    if (!isValidType) {
      return {
        valid: false,
        error: 'Invalid file format. Please upload a PNG, JPG, WebP, GIF, or SVG image.',
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`,
      };
    }

    return { valid: true };
  },

  /**
   * Upload sponsor logo image to Supabase Storage bucket ('sponsors')
   * or fallback to base64 Data URL if Supabase is offline / local.
   */
  async uploadSponsorLogo(file: File): Promise<string> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 1. Supabase Storage Upload
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const cleanFileName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase()
        .slice(0, 30);
      const filePath = `logos/${Date.now()}_${cleanFileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/png',
        });

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);

        // Friendly error messages for common Supabase storage configurations
        const errMsg = uploadError.message || '';
        if (
          errMsg.includes('Bucket not found') ||
          errMsg.includes('not found') ||
          (uploadError as { statusCode?: string }).statusCode === '404'
        ) {
          throw new Error(
            `Supabase Storage bucket '${BUCKET_NAME}' was not found. Please create a public bucket named '${BUCKET_NAME}' in your Supabase Dashboard under Storage > Buckets, or use the 'Image URL' option to paste a direct image URL.`
          );
        }

        if (
          errMsg.includes('row-level security') ||
          errMsg.includes('violates row-level security policy') ||
          (uploadError as { statusCode?: string }).statusCode === '403'
        ) {
          throw new Error(
            `Storage permission denied. Please ensure the '${BUCKET_NAME}' bucket in Supabase has public upload/read policies configured, or use the 'Image URL' option.`
          );
        }

        throw new Error(`Upload failed: ${errMsg}`);
      }

      // Retrieve and return public image URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to retrieve public URL for the uploaded image.');
      }

      return publicUrlData.publicUrl;
    }

    // 2. Local fallback (Data URL for offline development)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to Data URL.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file locally.'));
      reader.readAsDataURL(file);
    });
  },
};
