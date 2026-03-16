import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { categories } from '../../data/mockData';
import { toast } from 'sonner';

const DRAFT_KEY = 'atn_create_listing_draft';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Select a category'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().min(1, 'Price must be at least $1'),
  duration: z.coerce.number().min(15, 'Duration must be at least 15 minutes'),
  amenities: z.array(z.object({ value: z.string() })),
});
type FormData = z.infer<typeof schema>;

function loadDraft(): Partial<FormData> | null {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null'); } catch { return null; }
}

export default function CreateListing() {
  const navigate = useNavigate();
  const draft = loadDraft();

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: draft ?? { title: '', category: '', description: '', price: undefined, duration: undefined, amenities: [{ value: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'amenities' });
  const categoryValue = watch('category');

  // Auto-save draft
  useEffect(() => {
    const sub = watch(data => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  function onSubmit(_data: FormData) {
    localStorage.removeItem(DRAFT_KEY);
    toast.success('Listing published!');
    navigate('/provider/listings');
  }

  function saveDraft() {
    toast.success('Draft saved');
  }

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <Link to="/provider/listings" className="inline-flex items-center gap-2 text-muted mb-5 hover:text-foreground text-sm">
          <ArrowLeft size={16} /> Back to listings
        </Link>

        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Create New Listing</h1>
          <p className="text-sm text-muted">Add a new service for customers to book</p>
          {draft && <p className="text-xs text-primary mt-1">Draft restored</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card className="border-border p-5 lg:p-8 mb-6">
            <h2 className="text-lg font-medium mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <Label htmlFor="cl-title">Service Title *</Label>
                <Input id="cl-title" placeholder="e.g., Deep House Cleaning" className="mt-1" aria-invalid={!!errors.title} {...register('title')} />
                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
                <p className="text-xs text-muted mt-1">Clear, specific title that customers will see</p>
              </div>

              <div>
                <Label htmlFor="cl-cat">Category *</Label>
                <Select value={categoryValue} onValueChange={v => setValue('category', v)}>
                  <SelectTrigger id="cl-cat" className="mt-1" aria-invalid={!!errors.category}>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="cl-desc">Description *</Label>
                <Textarea id="cl-desc" placeholder="Describe what's included, your process, and what customers should expect…" className="mt-1 min-h-[120px]" aria-invalid={!!errors.description} {...register('description')} />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="cl-price">Price (USD) *</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                    <Input id="cl-price" type="number" min="1" placeholder="75" className="pl-7" aria-invalid={!!errors.price} {...register('price')} />
                  </div>
                  {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <Label htmlFor="cl-dur">Duration (minutes) *</Label>
                  <Input id="cl-dur" type="number" min="15" placeholder="120" className="mt-1" aria-invalid={!!errors.duration} {...register('duration')} />
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
                  <Input placeholder="e.g., Supplies included" className="flex-1" {...register(`amenities.${i}.value`)} />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} aria-label="Remove item" className="p-1.5 text-destructive hover:bg-destructive/10 rounded">
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
            <div className="border-2 border-dashed border-border rounded p-8 lg:p-12 text-center">
              <Upload size={36} className="mx-auto mb-3 text-muted" aria-hidden="true" />
              <p className="text-sm mb-1">Drag photos here or click to browse</p>
              <p className="text-xs text-muted">PNG, JPG up to 5MB each. First photo will be the cover image.</p>
              <Button type="button" variant="outline" className="mt-4">Choose files</Button>
            </div>
            <p className="text-xs text-muted mt-3">Good photos increase bookings by 3×. Show your work, setup, or process.</p>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => navigate('/provider/listings')} className="w-full sm:w-auto">
              Cancel
            </Button>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={saveDraft}>
                Save as draft
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none">
                Publish listing
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
