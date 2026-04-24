import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Search, BookOpen, FileText, HelpCircle } from 'lucide-react';
import { usePublishedResources } from '../../../hooks/usePublishedResources';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function Help() {
  const { resources, loading } = usePublishedResources('customer');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof resources[0] | null>(null);

  const filtered = resources.filter(
    r => !search.trim() || r.title.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen size={18} className="text-primary" />;
      case 'faq': return <HelpCircle size={18} className="text-primary" />;
      case 'tutorial': return <FileText size={18} className="text-primary" />;
      default: return <FileText size={18} className="text-primary" />;
    }
  };

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-[32px] font-semibold mb-2">Help & Resources</h1>
        <p className="text-sm text-muted mb-6">Guides, FAQs, and tips for using ATN</p>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="pl-10"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted text-center py-12">No resources found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <Card
                key={r.id}
                className="border-border p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelected(r)}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{typeIcon(r.type)}</div>
                  <div>
                    <h3 className="font-medium">{r.title}</h3>
                    <p className="text-xs text-muted mt-0.5 capitalize">{r.type}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
              {selected.content || 'No content yet.'}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
