import { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Plus, MapPin, Trash2, Edit, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useWifiHubs, type WifiHub } from '../../../hooks/useWifiHubs';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type HubDraft = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: string;
  lng: string;
  description: string;
  hours: string;
  network_name: string;
  access_notes: string;
  active: boolean;
};

function toDraft(hub?: WifiHub | null): HubDraft {
  return {
    name: hub?.name ?? '',
    address: hub?.address ?? '',
    city: hub?.city ?? '',
    state: hub?.state ?? '',
    zip: hub?.zip ?? '',
    lat: hub ? String(hub.lat) : '',
    lng: hub ? String(hub.lng) : '',
    description: hub?.description ?? '',
    hours: hub?.hours ?? '',
    network_name: hub?.network_name ?? '',
    access_notes: hub?.access_notes ?? '',
    active: hub?.active ?? true,
  };
}

export default function WifiHubsAdmin() {
  const [includeInactive, setIncludeInactive] = useState(true);
  const { hubs, loading, setHubs } = useWifiHubs({ includeInactive });
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<WifiHub | null>(null);

  const filtered = useMemo(() => {
    if (includeInactive) return hubs;
    return hubs.filter(h => h.active);
  }, [hubs, includeInactive]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="page-shell bg-gradient-hero border-b border-border py-6 lg:py-8">
        <div className="content-shell flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-teal flex items-center justify-center shrink-0">
              <Wifi size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-[32px] font-bold leading-tight">WiFi Hubs</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage free WiFi hub locations shown on the public map.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show inactive</span>
              <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
            </div>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto shadow-teal-sm gap-2">
                  <Plus size={16} /> + Add Hub
                </Button>
              </DialogTrigger>
              <HubDialogContent
                mode="create"
                initial={null}
                onClose={() => setCreateOpen(false)}
                onCreated={(hub) => {
                  setHubs(prev => [hub, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
                  setCreateOpen(false);
                }}
              />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="page-shell py-6 lg:py-8">
        <div className="content-shell">
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <Card className="card-lift rounded-2xl border-border p-10 text-center">
                <MapPin size={40} className="mx-auto text-muted-foreground mb-3" />
                <div className="font-semibold">No WiFi hubs yet</div>
                <div className="text-sm text-muted-foreground mt-1">Add your first hub to show it on the map.</div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground mt-5"
                  onClick={() => setCreateOpen(true)}
                >
                  Add Hub
                </Button>
              </Card>
            ) : (
              filtered.map((hub, i) => (
                <Card
                  key={hub.id}
                  className="card-lift rounded-2xl border-border p-5 animate-fade-up"
                  style={{ animationDelay: `${Math.min((i + 1) * 100, 700)}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <div className="w-7 h-7 rounded-lg bg-surface-teal flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-primary" />
                        </div>
                        <h3 className="font-semibold truncate">{hub.name}</h3>
                        {hub.active ? (
                          <span className="label-pill bg-surface-green text-status-green">
                            Active
                          </span>
                        ) : (
                          <span className="label-pill bg-surface-coral text-[#F4623A]">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground ml-9">{hub.address}</div>
                      <div className="text-xs text-muted-foreground mt-2 ml-9">
                        {hub.lat.toFixed(5)}, {hub.lng.toFixed(5)}
                        {hub.network_name ? <> • Network: <strong className="text-foreground">{hub.network_name}</strong></> : null}
                        {hub.hours ? <> • Hours: <strong className="text-foreground">{hub.hours}</strong></> : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setEditing(hub)}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={async () => {
                          const ok = confirm(`Delete hub "${hub.name}"?`);
                          if (!ok) return;
                          const { error } = await supabase.from('wifi_hubs').delete().eq('id', hub.id);
                          if (error) { toast.error('Failed to delete hub'); return; }
                          setHubs(prev => prev.filter(h => h.id !== hub.id));
                          toast.success('Hub deleted');
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

          <HubEditDialog
            hub={editing}
            onClose={() => setEditing(null)}
            onUpdated={(next) => {
              setHubs(prev => prev.map(h => h.id === next.id ? next : h).sort((a, b) => a.name.localeCompare(b.name)));
              setEditing(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HubEditDialog({ hub, onClose, onUpdated }: { hub: WifiHub | null; onClose: () => void; onUpdated: (hub: WifiHub) => void }) {
  return (
    <Dialog open={!!hub} onOpenChange={(o) => { if (!o) onClose(); }}>
      <HubDialogContent mode="edit" initial={hub} onClose={onClose} onUpdated={onUpdated} />
    </Dialog>
  );
}

function HubDialogContent({
  mode,
  initial,
  onClose,
  onCreated,
  onUpdated,
}: {
  mode: 'create' | 'edit';
  initial: WifiHub | null;
  onClose: () => void;
  onCreated?: (hub: WifiHub) => void;
  onUpdated?: (hub: WifiHub) => void;
}) {
  const [draft, setDraft] = useState<HubDraft>(() => toDraft(initial));
  const [saving, setSaving] = useState(false);
  const addressRef = useRef<HTMLInputElement | null>(null);

  const title = mode === 'create' ? 'Add WiFi Hub' : 'Edit WiFi Hub';
  const desc = mode === 'create'
    ? 'Create a new hub with a map pin location.'
    : 'Update hub details and location.';

  async function handleSave() {
    if (!draft.name.trim()) { toast.error('Name is required'); return; }
    if (!draft.address.trim()) { toast.error('Address is required'); return; }
    const lat = Number(draft.lat);
    const lng = Number(draft.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) { toast.error('Latitude and longitude are required'); return; }

    setSaving(true);
    const payload = {
      name: draft.name.trim(),
      address: draft.address.trim(),
      city: draft.city.trim() || null,
      state: draft.state.trim() || null,
      zip: draft.zip.trim() || null,
      lat,
      lng,
      description: draft.description.trim() || null,
      hours: draft.hours.trim() || null,
      network_name: draft.network_name.trim() || null,
      access_notes: draft.access_notes.trim() || null,
      active: draft.active,
    };

    if (mode === 'create') {
      const { data, error } = await supabase.from('wifi_hubs').insert(payload).select('*').single();
      setSaving(false);
      if (error || !data) { toast.error('Failed to create hub'); return; }
      toast.success('Hub created');
      onCreated?.(data as unknown as WifiHub);
      return;
    }

    const { data, error } = await supabase.from('wifi_hubs').update(payload).eq('id', initial!.id).select('*').single();
    setSaving(false);
    if (error || !data) { toast.error('Failed to update hub'); return; }
    toast.success('Hub updated');
    onUpdated?.(data as unknown as WifiHub);
  }

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{desc}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="hub-name">Name</Label>
            <Input id="hub-name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="hub-address">Address</Label>
            <Input
              id="hub-address"
              ref={el => { addressRef.current = el; }}
              value={draft.address}
              onChange={e => setDraft(d => ({ ...d, address: e.target.value }))}
              placeholder="Street address"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste an address, then set lat/lng below (or use autocomplete in a future iteration).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="hub-city">City</Label>
              <Input id="hub-city" value={draft.city} onChange={e => setDraft(d => ({ ...d, city: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="hub-state">State</Label>
              <Input id="hub-state" value={draft.state} onChange={e => setDraft(d => ({ ...d, state: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="hub-zip">Zip</Label>
              <Input id="hub-zip" value={draft.zip} onChange={e => setDraft(d => ({ ...d, zip: e.target.value }))} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hub-lat">Latitude</Label>
              <Input id="hub-lat" value={draft.lat} onChange={e => setDraft(d => ({ ...d, lat: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="hub-lng">Longitude</Label>
              <Input id="hub-lng" value={draft.lng} onChange={e => setDraft(d => ({ ...d, lng: e.target.value }))} className="mt-1" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">Inactive hubs are hidden from public map views</p>
            </div>
            <Switch checked={draft.active} onCheckedChange={(v) => setDraft(d => ({ ...d, active: v }))} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="hub-hours">Hours</Label>
            <Input id="hub-hours" value={draft.hours} onChange={e => setDraft(d => ({ ...d, hours: e.target.value }))} placeholder="e.g., Mon–Fri 9am–5pm" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="hub-network">Network name</Label>
            <Input id="hub-network" value={draft.network_name} onChange={e => setDraft(d => ({ ...d, network_name: e.target.value }))} placeholder="e.g., CommunityGuest" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="hub-notes">Access notes</Label>
            <Textarea id="hub-notes" value={draft.access_notes} onChange={e => setDraft(d => ({ ...d, access_notes: e.target.value }))} placeholder="e.g., Ask front desk for code" className="mt-1 min-h-24" />
          </div>

          <div>
            <Label htmlFor="hub-desc">Description</Label>
            <Textarea id="hub-desc" value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Optional description" className="mt-1 min-h-24" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" className="border-border" onClick={onClose}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving…' : mode === 'create' ? 'Create Hub' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
