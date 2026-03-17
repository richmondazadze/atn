import { supabase } from './supabase';

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (error) return null;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadListingImage(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('listing-images')
    .upload(path, file);

  if (error) return null;

  const { data } = supabase.storage.from('listing-images').getPublicUrl(path);
  return data.publicUrl;
}

export function getListingImageUrl(imageKey: string): string | undefined {
  const IMAGE_MAP: Record<string, string> = {
    'cleaning-1': 'https://images.unsplash.com/photo-1758523670691-95212c899c1c?auto=format&fit=crop&w=800&q=80',
    'cleaning-2': 'https://images.unsplash.com/photo-1758272422155-d898efd14f81?auto=format&fit=crop&w=800&q=80',
    'hair-1': 'https://images.unsplash.com/photo-1594254773847-9fce26e950bc?auto=format&fit=crop&w=800&q=80',
    'hair-2': 'https://images.unsplash.com/photo-1769694609721-98f8bab9735a?auto=format&fit=crop&w=800&q=80',
    'nails-1': 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?auto=format&fit=crop&w=800&q=80',
    'nails-2': 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?auto=format&fit=crop&w=800&q=80',
    'repair-1': 'https://images.unsplash.com/photo-1584677191047-38f48d0db64e?auto=format&fit=crop&w=800&q=80',
    'repair-2': 'https://images.unsplash.com/photo-1584677191047-38f48d0db64e?auto=format&fit=crop&w=800&q=80',
    'tutoring-1': 'https://images.unsplash.com/photo-1758685733907-42e9651721f5?auto=format&fit=crop&w=800&q=80',
    'wellness-1': 'https://images.unsplash.com/photo-1650044252595-cacd425982ff?auto=format&fit=crop&w=800&q=80',
  };

  if (imageKey.startsWith('http')) return imageKey;
  return IMAGE_MAP[imageKey];
}
