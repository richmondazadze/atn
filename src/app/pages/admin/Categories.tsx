import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Switch } from '../../components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import { useListings } from '../../../hooks/useListings';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

export default function CategoriesManager() {
  const { categories, loading: categoriesLoading, setCategories } = useCategories();
  const { listings, loading: listingsLoading } = useListings();
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newActive, setNewActive] = useState(true);
  const [editingCat, setEditingCat] = useState<{ id: string; name: string; icon: string } | null>(null);

  const loading = categoriesLoading || listingsLoading;

  const categoriesWithCounts = useMemo(() =>
    categories.map(cat => ({
      ...cat,
      listingCount: listings.filter(l => l.category_slug === cat.slug).length,
      isActive: cat.active,
    })), [categories, listings]);

  const resolvedActiveStates = useMemo(() => {
    const defaults = Object.fromEntries(categoriesWithCounts.map(c => [c.slug, c.active]));
    return { ...defaults, ...activeStates };
  }, [categoriesWithCounts, activeStates]);

  async function toggleActive(id: string, slug: string) {
    const currentActive = resolvedActiveStates[slug] ?? true;
    const newVal = !currentActive;
    setActiveStates(prev => ({ ...prev, [slug]: newVal }));
    const { error } = await supabase.from('categories').update({ active: newVal }).eq('id', id);
    if (error) {
      setActiveStates(prev => ({ ...prev, [slug]: currentActive }));
      toast.error('Failed to update category');
      return;
    }
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: newVal } : c));
    toast.success(`Category ${currentActive ? 'deactivated' : 'activated'}`);
  }

  async function handleCreate() {
    if (!newName.trim()) { toast.error('Category name is required'); return; }
    const slug = newName.trim().toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newName.trim(), slug, icon: newIcon.trim() || 'Tag', active: newActive })
      .select()
      .single();
    if (error) { toast.error('Failed to create category'); return; }
    setCategories(prev => [...prev, data]);
    setNewName(''); setNewIcon(''); setNewActive(true);
    setCreateOpen(false);
    toast.success('Category created');
  }

  async function handleEdit() {
    if (!editingCat) return;
    const { error } = await supabase
      .from('categories')
      .update({ name: editingCat.name, icon: editingCat.icon })
      .eq('id', editingCat.id);
    if (error) { toast.error('Failed to update category'); return; }
    setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, name: editingCat.name, icon: editingCat.icon } : c));
    setEditingCat(null);
    toast.success('Category updated');
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Category Management</h1>
            <p className="text-sm text-muted">Manage service categories and organization</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                <Plus size={15} className="mr-2" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new service category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input id="cat-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Pet Grooming" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cat-icon">Icon Name</Label>
                  <Input id="cat-icon" value={newIcon} onChange={e => setNewIcon(e.target.value)} placeholder="e.g., PawPrint" className="mt-1" />
                  <p className="text-xs text-muted mt-1">Lucide icon name (see lucide.dev)</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label>Active</Label>
                    <p className="text-xs text-muted">Make category visible to users</p>
                  </div>
                  <Switch checked={newActive} onCheckedChange={setNewActive} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" className="border-border" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button className="bg-primary text-primary-foreground" onClick={handleCreate}>Create Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Total Categories', value: categories.length, color: '' },
            { label: 'Active', value: Object.values(resolvedActiveStates).filter(Boolean).length, color: 'text-primary' },
            { label: 'Total Listings', value: listings.length, color: '' },
          ].map(s => (
            <Card key={s.label} className="border-border p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Icon</TableHead>
                  <TableHead>Listings</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoriesWithCounts.map(category => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium text-sm">{category.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="border-border font-mono text-xs">{category.icon}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">
                        {category.listingCount} listings
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={resolvedActiveStates[category.slug] ?? true}
                        onCheckedChange={() => toggleActive(category.id, category.slug)}
                        aria-label={`Toggle ${category.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingCat({ id: category.id, name: category.name, icon: category.icon })}>
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.error('Delete coming soon')}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={!!editingCat} onOpenChange={open => { if (!open) setEditingCat(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category details</DialogDescription>
            </DialogHeader>
            {editingCat && (
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="edit-cat-name">Category Name</Label>
                  <Input id="edit-cat-name" value={editingCat.name} onChange={e => setEditingCat({ ...editingCat, name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="edit-cat-icon">Icon Name</Label>
                  <Input id="edit-cat-icon" value={editingCat.icon} onChange={e => setEditingCat({ ...editingCat, icon: e.target.value })} className="mt-1" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" className="border-border" onClick={() => setEditingCat(null)}>Cancel</Button>
                  <Button className="bg-primary text-primary-foreground" onClick={handleEdit}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
