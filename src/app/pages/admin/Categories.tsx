import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Switch } from '../../components/ui/switch';
import { Plus, Edit, Trash2, LayoutGrid, CheckCircle, XCircle } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import { useListings } from '../../../hooks/useListings';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const STAGGER = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600', 'delay-700'];

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
      <LoadingSpinner />
    </div>
  );

  const activeCount = Object.values(resolvedActiveStates).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-5xl mx-auto animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-violet flex items-center justify-center shrink-0">
                <LayoutGrid size={22} className="text-violet" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="label-pill bg-surface-violet text-violet">Admin</span>
                </div>
                <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Category Management</h1>
                <p className="text-sm text-muted mt-0.5">Manage service categories and organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="label-pill bg-surface-green text-status-green animate-scale-in">
                <CheckCircle size={11} />
                {activeCount} Active
              </span>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    <Plus size={15} className="mr-2" /> New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 bg-surface-violet flex items-center justify-center">
                        <LayoutGrid size={16} className="text-violet" />
                      </div>
                      <div>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>Create a new service category</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label htmlFor="cat-name">Category Name</Label>
                      <Input
                        id="cat-name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="e.g., Pet Grooming"
                        className="mt-1 border-border focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cat-icon">Icon Name</Label>
                      <Input
                        id="cat-icon"
                        value={newIcon}
                        onChange={e => setNewIcon(e.target.value)}
                        placeholder="e.g., PawPrint"
                        className="mt-1 border-border focus:border-primary"
                      />
                      <p className="text-xs text-muted mt-1">Lucide icon name (see lucide.dev)</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary border border-border">
                      <div>
                        <Label>Active</Label>
                        <p className="text-xs text-muted">Make category visible to users</p>
                      </div>
                      <Switch checked={newActive} onCheckedChange={setNewActive} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 border-t border-border">
                      <Button variant="outline" className="border-border" onClick={() => setCreateOpen(false)}>Cancel</Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreate}>
                        Create Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-5xl mx-auto">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Categories', value: categories.length, surface: 'bg-surface-violet', icon: <LayoutGrid size={14} className="text-violet" />, text: 'text-violet' },
              { label: 'Active', value: activeCount, surface: 'bg-surface-green', icon: <CheckCircle size={14} className="text-status-green" />, text: 'text-status-green' },
              { label: 'Total Listings', value: listings.length, surface: 'bg-surface-teal', icon: <LayoutGrid size={14} className="text-primary" />, text: 'text-primary' },
            ].map((s, i) => (
              <Card key={s.label} className={`border-border p-4 card-lift animate-fade-up ${STAGGER[i]}`}>
                <div className={`inline-flex items-center justify-center w-8 h-8 ${s.surface} mb-2`}>
                  {s.icon}
                </div>
                <p className="text-xs text-muted mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.text}`}>{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card className="border-border overflow-hidden animate-fade-up delay-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary hover:bg-secondary">
                    <TableHead className="font-semibold text-foreground">Category</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold text-foreground">Icon</TableHead>
                    <TableHead className="font-semibold text-foreground">Listings</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Toggle</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesWithCounts.map((category, idx) => {
                    const isActive = resolvedActiveStates[category.slug] ?? true;
                    return (
                      <TableRow
                        key={category.id}
                        className={`animate-fade-up ${STAGGER[Math.min(idx, 7)]} ${idx % 2 === 1 ? 'bg-secondary/40' : ''} hover:bg-surface-teal/30 transition-colors`}
                      >
                        <TableCell className="font-medium text-sm">{category.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="border-border font-mono text-xs bg-secondary">
                            {category.icon}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-surface-teal text-primary border-0 text-xs">
                            {category.listingCount} listings
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="bg-surface-green text-status-green border-0 text-xs">
                              <CheckCircle size={10} className="mr-1" />Active
                            </Badge>
                          ) : (
                            <Badge className="bg-surface-coral text-coral border-0 text-xs">
                              <XCircle size={10} className="mr-1" />Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={isActive}
                            onCheckedChange={() => toggleActive(category.id, category.slug)}
                            aria-label={`Toggle ${category.name}`}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:bg-surface-teal hover:text-primary"
                              onClick={() => setEditingCat({ id: category.id, name: category.name, icon: category.icon })}
                            >
                              <Edit size={14} className="mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-coral hover:bg-surface-coral hover:text-coral"
                              disabled={category.listingCount > 0}
                              onClick={async () => {
                                if (category.listingCount > 0) {
                                  toast.error('Cannot delete category with existing listings. Reassign or remove listings first.');
                                  return;
                                }
                                const { error } = await supabase.from('categories').delete().eq('id', category.id);
                                if (error) { toast.error('Failed to delete category'); return; }
                                setCategories(prev => prev.filter(c => c.id !== category.id));
                                toast.success('Category deleted');
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Dialog open={!!editingCat} onOpenChange={open => { if (!open) setEditingCat(null); }}>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 bg-surface-teal flex items-center justify-center">
                    <Edit size={16} className="text-primary" />
                  </div>
                  <div>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>Update category details</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              {editingCat && (
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="edit-cat-name">Category Name</Label>
                    <Input
                      id="edit-cat-name"
                      value={editingCat.name}
                      onChange={e => setEditingCat({ ...editingCat, name: e.target.value })}
                      className="mt-1 border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-cat-icon">Icon Name</Label>
                    <Input
                      id="edit-cat-icon"
                      value={editingCat.icon}
                      onChange={e => setEditingCat({ ...editingCat, icon: e.target.value })}
                      className="mt-1 border-border focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <Button variant="outline" className="border-border" onClick={() => setEditingCat(null)}>Cancel</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleEdit}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
}
