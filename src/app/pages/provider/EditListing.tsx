import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { ArrowLeft, Upload, X, Trash2, AlertCircle, ImagePlus } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import { useListing } from '../../../hooks/useListings';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { uploadListingImage } from '../../../lib/storage';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Select a category'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().min(1, 'Price must be at least $1'),
  duration: z.coerce.number().min(15, 'Duration must be at least 15 minutes'),
  isActive: z.boolean(),
  amenities: z.array(z.object({ value: z.string() })),
});
type FormData = z.infer<typeof schema>;

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { listing, loading: listingLoading } = useListing(id);
  const { categories, loading: categoriesLoading } = useCategories();

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      price: undefined,
      duration: undefined,
      isActive: true,
      amenities: [{ value: '' }],
    },
  });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        category: listing.category_slug,
        description: listing.description,
        price: listing.price,
        duration: listing.duration,
        isActive: listing.status === 'active',
        amenities: (listing.amenities ?? ['Supplies included']).map(a => ({ value: a })),
      });
      setImages(listing.images ?? []);
    }
  }, [listing, reset]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const url = await uploadListingImage(user.id, file);
      if (url) uploaded.push(url);
    }
    if (uploaded.length > 0) {
      const updated = [...images, ...uploaded];
      setImages(updated);
      await supabase.from('listings').update({ images: updated }).eq('id', id!);
      toast.success(`${uploaded.length} photo${uploaded.length > 1 ? 's' : ''} uploaded`);
    } else {
      toast.error('Failed to upload photos');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    await supabase.from('listings').update({ images: updated }).eq('id', id!);
    toast.success('Photo removed');
  }

  const { fields, append, remove } = useFieldArray({ control, name: 'amenities' });
  const categoryValue = watch('category');
  const isActive = watch('isActive');

  const loading = listingLoading || categoriesLoading;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!listing) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-muted" />
          <h1 className="text-xl font-semibold mb-2">Listing not found</h1>
          <p className="text-sm text-muted mb-4">The listing you're looking for doesn't exist.</p>
          <Link to="/provider/listings">
            <Button variant="outline">Back to listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data: FormData) {
    const { error } = await supabase.from('listings').update({
      title: data.title,
      category_slug: data.category,
      description: data.description,
      price: data.price,
      duration: data.duration,
      status: data.isActive ? 'active' : 'draft',
      amenities: data.amenities.map(a => a.value).filter(Boolean),
      images,
    }).eq('id', id!);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Listing updated');
    navigate('/provider/listings');
  }

  async function handleDelete() {
    const { error } = await supabase.from('listings').update({ status: 'archived' }).eq('id', id!);
    if (error) { toast.error('Failed to delete listing'); return; }
    toast.success('Listing deleted');
    navigate('/provider/listings');
  }

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <Link to="/provider/listings" className="inline-flex items-center gap-2 text-muted mb-5 hover:text-foreground text-sm">
          <ArrowLeft size={16} /> Back to listings
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Edit Listing</h1>
            <p className="text-sm text-muted">Update your service details</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="active-toggle" className="text-sm">{isActive ? 'Active' : 'Inactive'}</Label>
            <Switch id="active-toggle" checked={isActive} onCheckedChange={v => setValue('isActive', v)} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card className="border-border p-5 lg:p-8 mb-6">
            <h2 className="text-lg font-medium mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <Label htmlFor="el-title">Service Title *</Label>
                <Input id="el-title" className="mt-1" aria-invalid={!!errors.title} {...register('title')} />
                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="el-cat">Category *</Label>
                <Select value={categoryValue} onValueChange={v => setValue('category', v)}>
                  <SelectTrigger id="el-cat" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="el-desc">Description *</Label>
                <Textarea id="el-desc" className="mt-1 min-h-[120px]" aria-invalid={!!errors.description} {...register('description')} />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="el-price">Price (USD) *</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                    <Input id="el-price" type="number" min="1" className="pl-7" aria-invalid={!!errors.price} {...register('price')} />
                  </div>
                  {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <Label htmlFor="el-dur">Duration (minutes) *</Label>
                  <Input id="el-dur" type="number" min="15" className="mt-1" aria-invalid={!!errors.duration} {...register('duration')} />
                  {errors.duration && <p className="text-xs text-destructive mt-1">{errors.duration.message}</p>}
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border p-5 lg:p-8 mb-6">
            <h2 className="text-lg font-medium mb-5">What's Included</h2>
            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input className="flex-1" {...register(`amenities.${i}.value`)} />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} aria-label="Remove" className="p-2.5 text-destructive hover:bg-destructive/10 rounded">
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
                + Add amenity
              </Button>
            </div>
          </Card>

          <Card className="border-border p-5 lg:p-8 mb-6">
            <h2 className="text-lg font-medium mb-5">Photos</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {images.map((url, i) => (
                  <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border bg-secondary">
                    <img src={url} alt={`Listing photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      <X size={14} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-muted">Uploading…</span>
                </div>
              ) : (
                <>
                  <ImagePlus size={28} className="mx-auto mb-2 text-muted" />
                  <p className="text-sm font-medium">{images.length > 0 ? 'Add more photos' : 'Upload photos'}</p>
                  <p className="text-xs text-muted mt-1">PNG, JPG, WebP up to 5MB each</p>
                </>
              )}
            </button>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" className="text-destructive w-full sm:w-auto">
                  <Trash2 size={15} className="mr-1.5" /> Delete listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{listing.title}" and cancel any pending bookings. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Yes, delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => navigate('/provider/listings')} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none">
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
