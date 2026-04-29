import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Search, BookOpen, FileText, HelpCircle, Lightbulb } from 'lucide-react';
import { usePublishedResources } from '../../../hooks/usePublishedResources';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const TYPE_CONFIG: Record<string, { icon: typeof BookOpen; surface: string; text: string; label: string }> = {
  guide: { icon: BookOpen, surface: 'bg-surface-teal', text: 'text-primary', label: 'Guide' },
  faq: { icon: HelpCircle, surface: 'bg-surface-amber', text: 'text-amber-600', label: 'FAQ' },
  tutorial: { icon: Lightbulb, surface: 'bg-surface-violet', text: 'text-violet', label: 'Tutorial' },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? { icon: FileText, surface: 'bg-secondary', text: 'text-muted', label: type };
}

export default function ProviderHelp() {
  const { resources, loading } = usePublishedResources('provider');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof resources[0] | null>(null);

  const filtered = resources.filter(
    r => !search.trim() || r.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/50 px-4 md:px-6 lg:px-[72px] py-8 lg:py-12 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 label-pill bg-surface-violet text-violet mb-4">
            <HelpCircle size={11} />
            Support Center
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">Help & Resources</h1>
          <p className="text-sm text-muted-foreground max-w-xl">Guides, FAQs, and tutorials to help you succeed as an ATN provider.</p>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-4xl mx-auto">

          {/* Search */}
          <div className="relative mb-8 animate-fade-up">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search help articles..."
              className="pl-12 h-12 text-base focus-glow rounded-xl border-border bg-background"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-surface-teal flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-primary" />
              </div>
              <p className="text-foreground font-semibold mb-1">No results found</p>
              <p className="text-sm text-muted">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r, i) => {
                const cfg = getTypeConfig(r.type);
                const Icon = cfg.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelected(r)}
                    className="w-full text-left border border-border rounded-2xl p-4 lg:p-5 bg-background card-lift animate-fade-up cursor-pointer"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.surface}`}>
                        <Icon size={18} className={cfg.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-0.5 truncate">{r.title}</h3>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text}`}>{cfg.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
              {selected.content || 'No content yet.'}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
