const BASE = 'https://images.unsplash.com/photo-';
const Q = '?auto=format&fit=crop&w=800&q=80';
const url = (id: string) => `${BASE}${id}${Q}`;

export const listingImages = {
  'cleaning-1': url('1758523670691-95212c899c1c'),
  'cleaning-2': url('1758272422155-d898efd14f81'),
  'hair-1':     url('1594254773847-9fce26e950bc'),
  'hair-2':     url('1769694609721-98f8bab9735a'),
  'nails-1':    url('1457972729786-0411a3b2b626'),
  'nails-2':    url('1457972729786-0411a3b2b626'),
  'repair-1':   url('1584677191047-38f48d0db64e'),
  'repair-2':   url('1584677191047-38f48d0db64e'),
  'tutoring-1': url('1758685733907-42e9651721f5'),
  'wellness-1': url('1650044252595-cacd425982ff'),
} as const;

export const providerAvatars: Record<string, string> = {
  '1': url('1759771716228-76a18921ca7d'), // Deja Johnson
  '2': url('1649539979560-7ab36bf5cdaa'), // Tasha Miles
};

export type ListingImageKey = keyof typeof listingImages;

export function getListingImage(key: string): string | undefined {
  return listingImages[key as ListingImageKey];
}
