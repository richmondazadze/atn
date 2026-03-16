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
import { toast } from 'sonner';

const resources = [
  { id: 1, title: 'How to Price Your Services', type: 'guide', category: 'provider', status: 'published', views: 1240, lastUpdated: '2026-02-15' },
  { id: 2, title: 'Safety Tips for Customers', type: 'article', category: 'customer', status: 'published', views: 890, lastUpdated: '2026-03-01' },
  { id: 3, title: 'Getting Started as a Provider', type: 'tutorial', category: 'provider', status: 'draft', views: 0, lastUpdated: '2026-03-10' },
  { id: 4, title: 'Understanding Payments and Fees', type: 'faq', category: 'both', status: 'published', views: 2150, lastUpdated: '2026-01-20' },
];

export default function ResourcesCMS() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredResources = resources.filter(r => {
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Resources & Help Content</h1>
            <p className="text-sm text-muted">Manage guides, FAQs, and educational content</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                <Plus size={15} className="mr-2" /> Create Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Resource</DialogTitle>
                <DialogDescription>Add educational content for users</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="res-title">Title</Label>
                    <Input id="res-title" placeholder="Resource title" className="mt-1" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <Select>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select audience" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="provider">Providers Only</SelectItem>
                      <SelectItem value="customer">Customers Only</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="res-content">Content</Label>
                  <Textarea id="res-content" placeholder="Write your content here..." className="mt-1 min-h-[160px]" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" className="border-border" onClick={() => toast.info('Saved as draft')}>Save as Draft</Button>
                  <Button className="bg-primary text-primary-foreground" onClick={() => toast.success('Resource published')}>Publish</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total Resources', value: resources.length, color: '' },
            { label: 'Published', value: resources.filter(r => r.status === 'published').length, color: 'text-primary' },
            { label: 'Drafts', value: resources.filter(r => r.status === 'draft').length, color: 'text-amber-500' },
            { label: 'Total Views', value: resources.reduce((s, r) => s + r.views, 0).toLocaleString(), color: '' },
          ].map(s => (
            <Card key={s.label} className="border-border p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border p-4 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="tutorial">Tutorials</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="faq">FAQs</SelectItem>
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

        {/* Resources List */}
        <div className="space-y-3">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <FileText size={16} className="text-primary shrink-0" />
                    <h3 className="font-medium truncate">{resource.title}</h3>
                    {resource.status === 'published' && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">Published</Badge>
                    )}
                    {resource.status === 'draft' && (
                      <Badge variant="secondary" className="text-xs">Draft</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted">
                    <span>Type: <strong className="text-foreground">{resource.type}</strong></span>
                    <span>Audience: <strong className="text-foreground">{resource.category}</strong></span>
                    <span>Views: <strong className="text-foreground">{resource.views.toLocaleString()}</strong></span>
                    <span>Updated: {new Date(resource.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => toast.info('Preview coming soon')}>
                    <Eye size={14} className="mr-1" /> Preview
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.info('Edit coming soon')}>
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.error('Delete coming soon')}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredResources.length === 0 && (
            <Card className="border-border p-12 text-center">
              <FileText size={40} className="mx-auto mb-4 text-muted" />
              <p className="text-muted text-sm">No resources found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
