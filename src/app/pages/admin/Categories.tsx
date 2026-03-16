import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Switch } from '../../components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categories, listings } from '../../data/mockData';
import { toast } from 'sonner';

const categoriesWithCounts = categories.map(cat => ({
  ...cat,
  listingCount: listings.filter(l => l.category === cat.id).length,
  isActive: true,
}));

export default function CategoriesManager() {
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    Object.fromEntries(categoriesWithCounts.map(c => [c.id, true]))
  );

  function toggleActive(id: string) {
    setActiveStates(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success(`Category ${activeStates[id] ? 'deactivated' : 'activated'}`);
  }

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Category Management</h1>
            <p className="text-sm text-muted">Manage service categories and organization</p>
          </div>
          <Dialog>
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
                  <Input id="cat-name" placeholder="e.g., Pet Grooming" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cat-icon">Icon Name</Label>
                  <Input id="cat-icon" placeholder="e.g., PawPrint" className="mt-1" />
                  <p className="text-xs text-muted mt-1">Lucide icon name (see lucide.dev)</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label>Active</Label>
                    <p className="text-xs text-muted">Make category visible to users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" className="border-border">Cancel</Button>
                  <Button className="bg-primary text-primary-foreground" onClick={() => toast.success('Category created')}>Create Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Total Categories', value: categories.length, color: '' },
            { label: 'Active', value: Object.values(activeStates).filter(Boolean).length, color: 'text-primary' },
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
                        checked={activeStates[category.id] ?? true}
                        onCheckedChange={() => toggleActive(category.id)}
                        aria-label={`Toggle ${category.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit size={14} className="mr-1" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>Update category details</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                              <div>
                                <Label htmlFor={`edit-name-${category.id}`}>Category Name</Label>
                                <Input id={`edit-name-${category.id}`} defaultValue={category.name} className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor={`edit-icon-${category.id}`}>Icon Name</Label>
                                <Input id={`edit-icon-${category.id}`} defaultValue={category.icon} className="mt-1" />
                              </div>
                              <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" className="border-border">Cancel</Button>
                                <Button className="bg-primary text-primary-foreground" onClick={() => toast.success('Category updated')}>Save Changes</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
      </div>
    </div>
  );
}
