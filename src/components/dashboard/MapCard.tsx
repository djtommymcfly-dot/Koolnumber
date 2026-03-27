import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Position, Service } from '../../types';
import { VF } from '../../lib/vodafone';

interface MapCardProps {
  selectedVehicle: Service | null;
}

const GMAPS_KEY = 'AIzaSyADREg9JW3CUXIOkod83RCD9eTHD3KrMCY';
const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0a1a0d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020a04' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a7a52' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a3d22' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5a9a62' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1b5e20' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#00e676' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0d1f11' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020e05' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1a3d22' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1a3020' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#00e676' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#7cb87f' }] },
];

export function MapCard({ selectedVehicle }: MapCardProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [poly, setPoly] = useState<any>(null);
  const [bread, setBread] = useState<{ lat: number; lng: number }[]>([]);
  const [pos, setPos] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;
      const gmap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 38.717, lng: -9.139 },
        zoom: 8,
        styles: MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative',
      });

      new window.google.maps.Polyline({
        map: gmap,
        path: VF._route,
        geodesic: true,
        strokeColor: 'rgba(0,230,118,0.2)',
        strokeOpacity: 1,
        strokeWeight: 2.5,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
              scale: 2.5,
              strokeColor: 'rgba(0,230,118,.4)',
              strokeWeight: 1.5,
            },
            offset: '100%',
            repeat: '100px',
          },
        ],
      });

      [{ p: VF._route[0], c: '#00e676' }, { p: VF._route[VF._route.length - 1], c: '#ff1744' }].forEach(({ p, c }) => {
        new window.google.maps.Marker({
          position: p,
          map: gmap,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: c,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
          },
        });
      });

      const mkIcon = (h: number) => ({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
          `<svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><circle cx="21" cy="21" r="19" fill="#020a04" stroke="#00e676" stroke-width="1.8"/><circle cx="21" cy="21" r="14" fill="rgba(0,230,118,0.07)" stroke="rgba(0,230,118,0.18)" stroke-width="1"/><text x="21" y="28" text-anchor="middle" font-size="17" fill="#00e676">🚍</text></svg>`
        )}`,
        scaledSize: new window.google.maps.Size(42, 42),
        anchor: new window.google.maps.Point(21, 21),
      });

      const vMarker = new window.google.maps.Marker({
        position: VF._route[0],
        map: gmap,
        icon: mkIcon(0),
        zIndex: 999,
      });

      const breadPoly = new window.google.maps.Polyline({
        map: gmap,
        path: [],
        geodesic: true,
        strokeColor: '#00e676',
        strokeOpacity: 0.6,
        strokeWeight: 2,
      });

      setMap(gmap);
      setMarker(vMarker);
      setPoly(breadPoly);
      setLoading(false);
    };

    if (!window.google) {
      const existingScript = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`);
      if (existingScript) {
        const checkGoogle = setInterval(() => {
          if (window.google) {
            clearInterval(checkGoogle);
            initMap();
          }
        }, 100);
      } else {
        const s = document.createElement('script');
        s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}`;
        s.async = true;
        s.defer = true;
        s.onload = initMap;
        s.onerror = () => {
          setLoading(false);
          setError(true);
        };
        document.head.appendChild(s);
      }
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (!map || !marker || !poly) return;

    const pollPos = async () => {
      const plate = selectedVehicle?.vehicle || 'AT-58-LP';
      const dId = `VF-${plate.replace(/-/g, '')}-001`;
      const position = await VF.getPosition(dId);
      setPos(position);

      const ll = { lat: position.lat, lng: position.lng };
      marker.setPosition(ll);
      
      const mkIcon = (h: number) => ({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
          `<svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg"><circle cx="21" cy="21" r="19" fill="#020a04" stroke="#00e676" stroke-width="1.8"/><circle cx="21" cy="21" r="14" fill="rgba(0,230,118,0.07)" stroke="rgba(0,230,118,0.18)" stroke-width="1"/><text x="21" y="28" text-anchor="middle" font-size="17" fill="#00e676">🚍</text></svg>`
        )}`,
        scaledSize: new window.google.maps.Size(42, 42),
        anchor: new window.google.maps.Point(21, 21),
      });
      marker.setIcon(mkIcon(position.heading));

      setBread((prev) => {
        const next = [...prev, ll];
        if (next.length > 100) next.shift();
        poly.setPath(next);
        return next;
      });

      if (!map.getBounds()?.contains(ll)) {
        map.panTo(ll);
      }
    };

    pollPos();
    const interval = setInterval(pollPos, 4000);
    return () => clearInterval(interval);
  }, [map, marker, poly, selectedVehicle]);

  useEffect(() => {
    if (map && marker && selectedVehicle) {
      map.panTo(marker.getPosition()!);
      map.setZoom(10);
    }
  }, [selectedVehicle, map, marker]);

  const HDIRS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const hDir = pos ? HDIRS[Math.round(pos.heading / 45) % 8] : 'N';

  return (
    <Card className="border-border bg-card/80 backdrop-blur-md overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          Vodafone Protect & Connect
        </CardTitle>
        <Badge variant="outline" className="font-mono text-[9px] tracking-wider uppercase border-primary/30 bg-primary/10 text-primary flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          LIVE
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[290px] w-full bg-muted/30">
          <div ref={mapRef} className="h-full w-full" />
          
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
              <div className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                A carregar mapa...
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="font-mono text-[10px] text-destructive tracking-widest uppercase text-center">
                Erro ao carregar Google Maps<br />
                <span className="text-muted-foreground">Verifica a chave API</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="absolute left-3 top-3 z-10 rounded-xl border border-border bg-background/90 p-3 backdrop-blur-md shadow-lg">
                <div className="font-mono text-3xl font-bold leading-none text-primary">
                  {pos?.speed ?? '—'}
                </div>
                <div className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase mt-1">
                  km/h
                </div>
              </div>

              <div className="absolute right-3 top-3 z-10 rounded-xl border border-border bg-background/90 p-3 backdrop-blur-md shadow-lg text-right">
                <div className="font-mono text-sm font-bold tracking-widest text-primary">
                  {selectedVehicle?.vehicle || 'AT-58-LP'}
                </div>
                <div className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase mt-1">
                  {selectedVehicle?.clients[0] || 'PRIMAVERA'}
                </div>
                <div className="font-mono text-[8px] tracking-widest text-muted-foreground/60 uppercase mt-1">
                  ● VF {pos?.source || 'MOCK'}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 border-b border-border pb-4">
            <div className="flex justify-between items-center font-mono">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Latitude</span>
              <span className="text-xs font-bold text-primary">{pos?.lat.toFixed(5) ?? '—'}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Longitude</span>
              <span className="text-xs font-bold text-primary">{pos?.lng.toFixed(5) ?? '—'}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Direção</span>
              <span className="text-xs font-bold text-primary">{pos ? `${hDir} ${Math.round(pos.heading)}°` : '—'}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Velocidade</span>
              <span className="text-xs font-bold text-primary">{pos?.speed ?? '—'} km/h</span>
            </div>
            <div className="flex justify-between items-center font-mono col-span-2">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Actualizado</span>
              <span className="text-xs font-bold text-primary">{pos ? new Date(pos.timestamp).toLocaleTimeString('pt-PT') : '--:--:--'}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-lg font-bold tracking-widest text-primary">
                {selectedVehicle?.vehicle || 'AT-58-LP'}
              </div>
              <div className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase mt-1">
                {selectedVehicle?.clients[0] || 'PRIMAVERA'} · {selectedVehicle?.type === 'PARTIDA' ? 'Em Partida' : 'Em Chegada'}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={`font-mono text-[9px] tracking-wider uppercase ${selectedVehicle?.tracker === 'S5' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-primary/30 bg-primary/10 text-primary'}`}>
                {selectedVehicle?.tracker || 'S5'}
              </Badge>
              <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
                VF·{selectedVehicle?.vehicle.replace(/-/g, '') || 'AT58LP'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
