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
   * Upload business logo image to Supabase Storage or fallback to base64 Data URL
   */
  async uploadBusinessLogo(file: File): Promise<string> {
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
      const filePath = `business-logos/${Date.now()}_${cleanFileName}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'image/png',
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to local base64:', err);
      }
    }

    // 2. Local / offline fallback (Data URL)
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

  /**
   * Upload sponsor logo image to Supabase Storage bucket ('sponsors')
   * with resilient fallback to Data URL if the cloud bucket is pending initialization.
   */
  async uploadSponsorLogo(file: File): Promise<string> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 1. Attempt Supabase Storage Upload if Supabase is configured
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const cleanFileName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase()
        .slice(0, 30);
      const filePath = `logos/${Date.now()}_${cleanFileName}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'image/png',
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        } else {
          console.warn('Supabase storage upload error:', uploadError.message);
          // If bucket is not found or permissions issue, fall through to resilient local Data URL
        }
      } catch (err) {
        console.warn('Supabase Storage connection failed, falling back to inline Data URL:', err);
      }
    }

    // 2. Resilient fallback (Data URL for instant preview, offline, or pending cloud bucket)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to process image file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file from disk.'));
      reader.readAsDataURL(file);
    });
  },
};
