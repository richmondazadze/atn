import { useMemo, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, Wifi } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useWifiHubs } from '../../../hooks/useWifiHubs';
import { WifiHubsMap } from '../../components/WifiHubsMap';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function WifiHubsPublicPage() {
  const { hubs, loading } = useWifiHubs();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => hubs.find(h => h.id === selectedId) ?? null, [hubs, selectedId]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero border-b border-border">
        <div className="px-4 md:px-6 lg:px-[72px] py-10 lg:py-14 max-w-7xl mx-auto">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-teal flex items-center justify-center shrink-0">
                <Wifi size={20} className="text-primary" />
              </div>
              <span className="label-pill bg-surface-teal text-primary text-xs font-semibold">Community Access</span>
            </div>
            <h1 className="text-3xl lg:text-[40px] font-bold tracking-tight mb-3">
              <span className="text-gradient-teal">Free Community</span> WiFi Hubs
            </h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Find nearby free WiFi hubs with clear access notes. Locations update in real time as hubs are added or changed.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* List */}
          <div className="lg:col-span-1 animate-fade-up delay-100">
            <Card className="border-border p-4 lg:p-5 h-auto lg:h-[640px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">Locations</div>
                <span className="label-pill bg-surface-teal text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {hubs.length} hub{hubs.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Mobile Select */}
              <div className="lg:hidden mb-4">
                <Select value={selectedId || 'none'} onValueChange={v => setSelectedId(v === 'none' ? null : v)}>
                  <SelectTrigger className="w-full h-12 bg-background border-border">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose a hub...</SelectItem>
                    {hubs.map(h => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hubs.length === 0 ? (
                <div className="text-sm text-muted py-8 text-center">No hubs available yet.</div>
              ) : (
                <div className="hidden lg:block space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                  {hubs.map(h => {
                    const active = h.id === selectedId;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedId(h.id)}
                        className={`w-full text-left rounded-xl border px-3 py-3 transition-all duration-200 ${
                          active
                            ? 'border-primary bg-surface-teal shadow-sm'
                            : 'border-border hover:bg-surface-teal/50 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className={active ? 'text-primary shrink-0' : 'text-muted shrink-0'} />
                              <div className={`font-medium text-sm truncate ${active ? 'text-primary' : ''}`}>{h.name}</div>
                            </div>
                            <div className="text-xs text-muted mt-1 line-clamp-2 pl-5">{h.address}</div>
                            {h.hours && <div className="text-xs text-muted mt-1 pl-5">Hours: {h.hours}</div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selected && (
                <div className="mt-4 pt-4 border-t border-border shrink-0">
                  <div className="rounded-xl bg-surface-teal border border-primary/20 p-3 mb-3">
                    <div className="text-sm font-semibold text-primary mb-2">{selected.name}</div>
                    <div className="text-xs text-muted">{selected.address}</div>
                    {selected.network_name && (
                      <div className="text-xs text-muted mt-1">
                        <span className="font-medium text-foreground">Network:</span> {selected.network_name}
                      </div>
                    )}
                    {selected.access_notes && (
                      <div className="text-xs text-muted mt-1">
                        <span className="font-medium text-foreground">Notes:</span> {selected.access_notes}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="border-border w-full hover:border-primary/40 hover:bg-surface-teal/50 transition-colors" onClick={() => setSelectedId(null)}>
                    Clear selection
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 animate-fade-up delay-200">
            <WifiHubsMap
              hubs={hubs}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
