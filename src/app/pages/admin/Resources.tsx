import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { useResources, type Resource } from '../../../hooks/useResources';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { EmptyState } from '../../components/EmptyState';

const RESOURCE_TYPES = ['guide', 'tutorial', 'article', 'faq'] as const;
const RESOURCE_CATEGORIES = ['provider', 'customer', 'both'] as const;

export default function ResourcesCMS() {
  const { resources, loading, refetch, setResources } = useResources();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const filteredResources = resources.filter(r => {
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesType && matchesStatus;
  });

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Resources & Help Content</h1>
            <p className="text-sm text-muted">Manage guides, FAQs, and educational content</p>
          </div>
          <CreateResourceDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={() => { setCreateOpen(false); refetch(); }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total Resources', value: resources.length, color: '' },
            { label: 'Published', value: resources.filter(r => r.status === 'published').length, color: 'text-primary' },
            { label: 'Drafts', value: resources.filter(r => r.status === 'draft').length, color: 'text-amber-500' },
            { label: 'Total Views', value: resources.reduce((s, r) => s + (r.views ?? 0), 0).toLocaleString(), color: '' },
          ].map(s => (
            <Card key={s.label} className="border-border p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        <Card className="border-border p-4 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {RESOURCE_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}s</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredResources.length === 0 ? (
            <EmptyState
              icon={<FileText size={40} />}
              title="No resources"
              description="Create your first resource to help users."
              action={
                <Button className="bg-primary text-primary-foreground" onClick={() => setCreateOpen(true)}>Create Resource</Button>
              }
            />
          ) : (
            filteredResources.map(resource => (
              <Card key={resource.id} className="border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <FileText size={16} className="text-primary shrink-0" />
                      <h3 className="font-medium truncate">{resource.title}</h3>
                      {resource.status === 'published' && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">Published</Badge>
                      )}
                      {resource.status === 'draft' && <Badge variant="secondary" className="text-xs">Draft</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted">
                      <span>Type: <strong className="text-foreground">{resource.type}</strong></span>
                      <span>Audience: <strong className="text-foreground">{resource.category}</strong></span>
                      <span>Views: <strong className="text-foreground">{(resource.views ?? 0).toLocaleString()}</strong></span>
                      <span>Updated: {new Date(resource.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <PreviewResourceDialog resource={resource} />
                    <Button variant="ghost" size="sm" onClick={() => setEditingResource(resource)}>
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={async () => {
                        const { error } = await supabase.from('resources').delete().eq('id', resource.id);
                        if (error) { toast.error('Failed to delete'); return; }
                        setResources(prev => prev.filter(r => r.id !== resource.id));
                        toast.success('Resource deleted');
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <EditResourceDialog resource={editingResource} onClose={() => setEditingResource(null)} onSuccess={() => { setEditingResource(null); refetch(); }} />
      </div>
    </div>
  );
}

function CreateResourceDialog({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (v: boolean) => void; onSuccess: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
          <Plus size={15} className="mr-2" /> Create Resource
        </Button>
      </DialogTrigger>
      <CreateResourceDialogContent onSuccess={onSuccess} />
    </Dialog>
  );
}

function CreateResourceDialogContent({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'guide' | 'tutorial' | 'article' | 'faq'>('guide');
  const [category, setCategory] = useState<'provider' | 'customer' | 'both'>('both');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreate(status: 'draft' | 'published') {
    if (!title.trim()) { toast.error('Title is required'); return; }
    const slug = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSaving(true);
    const { error } = await supabase.from('resources').insert({
      title: title.trim(),
      slug: slug || 'resource-' + Date.now(),
      type,
      category,
      content: content.trim(),
      status,
    });
    setSaving(false);
    if (error) { toast.error('Failed to create resource'); return; }
    toast.success(status === 'published' ? 'Resource published' : 'Saved as draft');
    setTitle(''); setType('guide'); setCategory('both'); setContent('');
    onSuccess();
  }

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create New Resource</DialogTitle>
        <DialogDescription>Add educational content for users</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <Label htmlFor="res-title">Title</Label>
          <Input id="res-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource title" className="mt-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v: 'guide' | 'tutorial' | 'article' | 'faq') => setType(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target Audience</Label>
            <Select value={category} onValueChange={(v: 'provider' | 'customer' | 'both') => setCategory(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="provider">Providers Only</SelectItem>
                <SelectItem value="customer">Customers Only</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="res-content">Content</Label>
          <Textarea id="res-content" value={content} onChange={e => setContent(e.target.value)} placeholder="Write your content here..." className="mt-1 min-h-[160px]" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" className="border-border" disabled={saving} onClick={() => handleCreate('draft')}>Save as Draft</Button>
          <Button className="bg-primary text-primary-foreground" disabled={saving} onClick={() => handleCreate('published')}>Publish</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function PreviewResourceDialog({ resource }: { resource: Resource }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye size={14} className="mr-1" /> Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
          <DialogDescription>{resource.type} • {resource.category}</DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{resource.content || 'No content yet.'}</div>
      </DialogContent>
    </Dialog>
  );
}

function EditResourceDialog({ resource, onClose, onSuccess }: { resource: Resource | null; onClose: () => void; onSuccess: () => void }) {
  if (!resource) return null;

  return (
    <Dialog open={!!resource} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>Update resource details</DialogDescription>
        </DialogHeader>
        <EditResourceForm
          resource={resource}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditResourceForm({ resource, onSuccess, onCancel }: { resource: Resource; onSuccess: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState(resource.title);
  const [type, setType] = useState(resource.type);
  const [category, setCategory] = useState(resource.category);
  const [content, setContent] = useState(resource.content ?? '');
  const [status, setStatus] = useState(resource.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const { error } = await supabase.from('resources').update({
      title: title.trim(),
      type,
      category,
      content: content.trim(),
      status,
      updated_at: new Date().toISOString(),
    }).eq('id', resource.id);
    setSaving(false);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Resource updated');
    onSuccess();
  }

  return (
    <div className="space-y-4 py-2">
      <div>
        <Label htmlFor="edit-res-title">Title</Label>
        <Input id="edit-res-title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={(v: 'guide' | 'tutorial' | 'article' | 'faq') => setType(v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Target Audience</Label>
          <Select value={category} onValueChange={(v: 'provider' | 'customer' | 'both') => setCategory(v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="provider">Providers Only</SelectItem>
              <SelectItem value="customer">Customers Only</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="edit-res-content">Content</Label>
        <Textarea id="edit-res-content" value={content} onChange={e => setContent(e.target.value)} className="mt-1 min-h-[160px]" />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(v: 'draft' | 'published') => setStatus(v)}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" className="border-border" onClick={onCancel}>Cancel</Button>
        <Button className="bg-primary text-primary-foreground" disabled={saving} onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
