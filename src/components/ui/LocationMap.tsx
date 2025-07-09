import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  className?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  latitude, 
  longitude, 
  className = "w-full h-64" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // You'll need to add your Mapbox token here
    mapboxgl.accessToken = 'pk.your-mapbox-token-here';
    
    // Default to center of US if no coordinates
    const defaultLat = latitude || 39.8283;
    const defaultLng = longitude || -98.5795;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [defaultLng, defaultLat],
      zoom: latitude && longitude ? 12 : 4,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add marker if coordinates are provided
    if (latitude && longitude) {
      marker.current = new mapboxgl.Marker({
        color: 'hsl(var(--primary))'
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Cleanup
    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (map.current && latitude && longitude) {
      if (marker.current) {
        marker.current.setLngLat([longitude, latitude]);
      } else {
        marker.current = new mapboxgl.Marker({
          color: 'hsl(var(--primary))'
        })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      }
      
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        duration: 1000
      });
    }
  }, [latitude, longitude]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!latitude || !longitude ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <p className="text-muted-foreground text-sm">
            Location data unavailable
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default LocationMap;