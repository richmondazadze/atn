import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { Button } from './ui/button';
import type { WifiHub } from '../../hooks/useWifiHubs';

type Props = {
  hubs: WifiHub[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

const DEFAULT_CENTER = { lat: 35.8423, lng: -90.7043 }; // Jonesboro, AR

function getGoogleMapsKey(): string | null {
  const k = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  return k && k.trim().length > 0 ? k.trim() : null;
}

export function WifiHubsMap({ hubs, selectedId, onSelect, className }: Props) {
  const key = getGoogleMapsKey();
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!key) { setLoadError('Missing Google Maps API key.'); return; }
    if (!mapDivRef.current) return;

    setOptions({ apiKey: key, version: 'weekly' });
    Promise.all([importLibrary('maps'), importLibrary('places')])
      .then(([mapsLib, placesLib]) => {
        if (cancelled) return;
        setLoaded(true);
        setLoadError(null);

        const { Map } = mapsLib as google.maps.MapsLibrary;
        const { Autocomplete } = placesLib as google.maps.PlacesLibrary;

        const map = new Map(mapDivRef.current!, {
          center: DEFAULT_CENTER,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapRef.current = map;
        infoRef.current = new google.maps.InfoWindow();

        if (searchRef.current) {
          const ac = new Autocomplete(searchRef.current, {
            fields: ['geometry', 'formatted_address'],
          });
          autocompleteRef.current = ac;
          ac.addListener('place_changed', () => {
            const place = ac.getPlace();
            const loc = place.geometry?.location;
            if (!loc || !mapRef.current) return;
            mapRef.current.setCenter({ lat: loc.lat(), lng: loc.lng() });
            mapRef.current.setZoom(13);
          });
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : 'Failed to load Google Maps.');
      });

    return () => { cancelled = true; };
  }, [key, hubs.length]);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const map = mapRef.current;
    const info = infoRef.current;

    const nextIds = new Set(hubs.map(h => h.id));
    for (const [id, marker] of markersRef.current.entries()) {
      if (!nextIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    }

    hubs.forEach((hub) => {
      const existing = markersRef.current.get(hub.id);
      const pos = { lat: hub.lat, lng: hub.lng };
      if (!existing) {
        const marker = new google.maps.Marker({
          position: pos,
          map,
          title: hub.name,
        });
        marker.addListener('click', () => {
          onSelect(hub.id);
        });
        markersRef.current.set(hub.id, marker);
      } else {
        existing.setPosition(pos);
        existing.setTitle(hub.name);
      }
    });

    if (selectedId) {
      const hub = hubs.find(h => h.id === selectedId);
      const marker = selectedId ? markersRef.current.get(selectedId) : undefined;
      if (hub && marker) {
        const html = `
          <div style="max-width: 260px">
            <div style="font-weight: 600; margin-bottom: 4px;">${hub.name}</div>
            <div style="font-size: 12px; opacity: 0.85; margin-bottom: 6px;">${hub.address}</div>
            ${hub.hours ? `<div style="font-size: 12px; margin-bottom: 4px;"><strong>Hours:</strong> ${hub.hours}</div>` : ''}
            ${hub.network_name ? `<div style="font-size: 12px; margin-bottom: 4px;"><strong>Network:</strong> ${hub.network_name}</div>` : ''}
            ${hub.access_notes ? `<div style="font-size: 12px;"><strong>Notes:</strong> ${hub.access_notes}</div>` : ''}
          </div>
        `;
        info?.setContent(html);
        info?.open({ map, anchor: marker });
        map.panTo({ lat: hub.lat, lng: hub.lng });
      } else {
        info?.close();
      }
    } else {
      info?.close();
    }
  }, [hubs, loaded, onSelect, selectedId]);

  async function useMyLocation() {
    if (!mapRef.current) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        mapRef.current?.setZoom(13);
      },
      () => {
        // ignore
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  if (!key) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-border bg-secondary/20 p-6">
          <div className="font-medium mb-2">Map unavailable</div>
          <div className="text-sm text-muted">Missing `VITE_GOOGLE_MAPS_API_KEY`.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3">
        <input
          ref={searchRef}
          placeholder="Search a city or address…"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button variant="outline" className="border-border shrink-0" onClick={useMyLocation}>
          Use my location
        </Button>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-border bg-secondary/20 p-6 text-sm text-muted">
          {loadError}
        </div>
      ) : (
        <div ref={mapDivRef} className="h-[480px] lg:h-[640px] w-full rounded-2xl border border-border overflow-hidden" />
      )}
    </div>
  );
}

