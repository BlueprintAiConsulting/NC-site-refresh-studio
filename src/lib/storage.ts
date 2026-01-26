import { supabase } from '@/integrations/supabase/client';

const STORAGE_BUCKET = 'church-photos';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadPhoto(
  file: File,
  folder: string = 'gallery'
): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Upload multiple files
 */
export async function uploadPhotos(
  files: File[],
  folder: string = 'gallery'
): Promise<UploadResult[]> {
  const uploads = files.map((file) => uploadPhoto(file, folder));
  return Promise.all(uploads);
}

/**
 * Delete a photo from storage
 */
export async function deletePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

/**
 * List all photos in a folder
 */
export async function listPhotos(folder: string = 'gallery') {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get public URL for a storage path
 */
export function getPhotoUrl(path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return publicUrl;
}
