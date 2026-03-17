import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Upload, MapPin, Instagram, Facebook, ShieldCheck, X } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { uploadAvatar } from '../../../lib/storage';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(300, 'Bio must be 300 characters or less'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  instagram: z.string(),
  facebook: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function ProfileEditor() {
  const { user } = useAuth();
  const { categories, loading } = useCategories();

  const [selectedCategories, setSelectedCategories] = useState(['hair-braiding']);
  const [zipCodes, setZipCodes] = useState(['72401', '72404', '72405']);
  const [newZip, setNewZip] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      bio: 'Licensed braider specializing in knotless, box braids, and protective styles. Trained at Paul Mitchell. Your hair health is my priority.',
      phone: user.phone ?? '',
      instagram: '@tashabraidsjonesboro',
      facebook: '',
    },
  });

  const bio = watch('bio');

  function toggleCategory(id: string) {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  }

  function addZip() {
    const z = newZip.trim();
    if (z.length === 5 && /^\d+$/.test(z) && !zipCodes.includes(z)) {
      setZipCodes(prev => [...prev, z]);
    }
    setNewZip('');
  }

  function removeZip(zip: string) {
    setZipCodes(prev => prev.filter(z => z !== zip));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const url = await uploadAvatar(user.id, file);
    if (url) {
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      setAvatarUrl(url);
      toast.success('Avatar updated');
    } else {
      toast.error('Upload failed');
    }
    setUploadingAvatar(false);
  }

  async function onSave(data: FormData) {
    const { error: profileError } = await supabase.from('profiles').update({
      name: data.name,
      phone: data.phone,
      bio: data.bio,
    }).eq('id', user.id);
    if (profileError) { toast.error('Failed to save profile'); return; }

    const { error: providerError } = await supabase.from('providers').update({
      zip_codes: zipCodes,
      categories: selectedCategories,
    }).eq('id', user.id);
    if (providerError) { toast.error('Failed to save provider details'); return; }

    toast.success('Profile saved');
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Edit Profile</h1>
            <p className="text-sm text-muted">Update your public provider profile</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={handleSubmit(onSave)}
          >
            Save Changes
          </Button>
        </div>

        {/* Profile Photo */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <h2 className="text-lg font-medium mb-5">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="relative group"
              disabled={uploadingAvatar}
            >
              <Avatar className="w-20 h-20 shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
                <AvatarFallback className="bg-primary/20 text-xl font-semibold">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={18} className="text-white" />
              </div>
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </button>
            <div>
              <Button
                type="button"
                variant="outline"
                className="border-border mb-2"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                <Upload size={15} className="mr-2" />
                {uploadingAvatar ? 'Uploading…' : 'Upload New Photo'}
              </Button>
              <p className="text-xs text-muted">JPG or PNG. Max 5MB. Square images work best.</p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <h2 className="text-lg font-medium mb-5">Basic Information</h2>
          <form className="space-y-5">
            <div>
              <Label htmlFor="pe-name">Display Name</Label>
              <Input id="pe-name" className="mt-1" aria-invalid={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="pe-bio">Bio</Label>
              <Textarea id="pe-bio" className="mt-1 resize-none" rows={4} maxLength={300} aria-invalid={!!errors.bio} {...register('bio')} />
              <p className="text-xs text-muted mt-1">{bio?.length ?? 0}/300 characters</p>
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label htmlFor="pe-phone">Phone Number</Label>
                <Input id="pe-phone" type="tel" className="mt-1" aria-invalid={!!errors.phone} {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="pe-email">Email</Label>
                <Input id="pe-email" type="email" value={user.email} className="mt-1" disabled />
                <p className="text-xs text-muted mt-1">Contact support to change your email.</p>
              </div>
            </div>
          </form>
        </Card>

        {/* Service Categories */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <h2 className="text-lg font-medium mb-1">Service Categories</h2>
          <p className="text-sm text-muted mb-5">Select up to 3 categories that match your services</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(category => {
              const isSelected = selectedCategories.includes(category.slug);
              const isDisabled = !isSelected && selectedCategories.length >= 3;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => toggleCategory(category.slug)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  className={`p-4 border rounded text-left transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : isDisabled
                      ? 'border-border bg-secondary opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{category.name}</div>
                  {isSelected && (
                    <Badge className="bg-primary text-primary-foreground border-0 text-xs">Selected</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Service Area */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <h2 className="text-lg font-medium mb-1">Service Area</h2>
          <p className="text-sm text-muted mb-5">ZIP codes where you offer services</p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter ZIP code"
                value={newZip}
                onChange={e => setNewZip(e.target.value)}
                maxLength={5}
                className="flex-1"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addZip())}
              />
              <Button variant="outline" className="border-border shrink-0" onClick={addZip}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {zipCodes.map(zip => (
                <Badge key={zip} variant="secondary" className="gap-1.5 pr-1">
                  <MapPin size={11} />
                  {zip}
                  <button
                    type="button"
                    onClick={() => removeZip(zip)}
                    aria-label={`Remove ZIP code ${zip}`}
                    className="hover:text-destructive ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="border-border p-5 lg:p-8 mb-6">
          <h2 className="text-lg font-medium mb-5">Social Links</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pe-instagram" className="flex items-center gap-2">
                <Instagram size={15} /> Instagram
              </Label>
              <Input id="pe-instagram" placeholder="@yourusername" className="mt-1" {...register('instagram')} />
            </div>
            <div>
              <Label htmlFor="pe-facebook" className="flex items-center gap-2">
                <Facebook size={15} /> Facebook
              </Label>
              <Input id="pe-facebook" placeholder="Your Facebook page name" className="mt-1" {...register('facebook')} />
            </div>
          </div>
        </Card>

        {/* Verification Status */}
        <Card className="border-primary bg-primary/5 p-5 lg:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck size={22} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Verification Status: Verified</h3>
              <p className="text-sm text-muted mb-3">
                Your identity and background check have been verified. This badge appears on your profile.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-primary text-primary-foreground border-0">ID Verified</Badge>
                <Badge className="bg-primary text-primary-foreground border-0">Background Check</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
