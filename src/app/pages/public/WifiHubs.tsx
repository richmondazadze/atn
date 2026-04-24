import { useMemo, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, Wifi } from 'lucide-react';
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
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Wifi size={18} className="text-primary" />
            <h1 className="text-2xl lg:text-[32px] font-semibold">Free Community WiFi Hubs</h1>
          </div>
          <p className="text-sm text-muted max-w-2xl">
            Find nearby free WiFi hubs with clear access notes. Locations update in real time as hubs are added or changed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* List */}
          <div className="lg:col-span-1">
            <Card className="border-border p-4 lg:p-5 h-[480px] lg:h-[640px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Locations</div>
                <div className="text-xs text-muted">{hubs.length} hub{hubs.length === 1 ? '' : 's'}</div>
              </div>

              {hubs.length === 0 ? (
                <div className="text-sm text-muted py-8 text-center">No hubs available yet.</div>
              ) : (
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                  {hubs.map(h => {
                    const active = h.id === selectedId;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedId(h.id)}
                        className={`w-full text-left rounded-lg border px-3 py-3 transition-colors ${
                          active ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-primary shrink-0" />
                              <div className="font-medium text-sm truncate">{h.name}</div>
                            </div>
                            <div className="text-xs text-muted mt-1 line-clamp-2">{h.address}</div>
                            {h.hours && <div className="text-xs text-muted mt-1">Hours: {h.hours}</div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selected && (
                <div className="mt-4 pt-4 border-t border-border shrink-0">
                  <div className="text-sm font-medium mb-2">Selected hub</div>
                  <div className="text-xs text-muted">{selected.address}</div>
                  {selected.network_name && <div className="text-xs text-muted mt-1">Network: {selected.network_name}</div>}
                  {selected.access_notes && <div className="text-xs text-muted mt-1">Notes: {selected.access_notes}</div>}
                  <Button variant="outline" className="border-border mt-3 w-full" onClick={() => setSelectedId(null)}>
                    Clear selection
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
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

