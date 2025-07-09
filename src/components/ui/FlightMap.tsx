import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FlightPosition, HomePosition } from '@/types';
import { Layers, Navigation, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlightMapProps {
  currentPosition?: FlightPosition;
  homePosition?: HomePosition;
  flightPath?: FlightPosition[];
  className?: string;
}

const FlightMap: React.FC<FlightMapProps> = ({ 
  currentPosition, 
  homePosition,
  flightPath = [],
  className = "w-full h-96" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const vehicleMarker = useRef<mapboxgl.Marker | null>(null);
  const homeMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [followVehicle, setFollowVehicle] = useState(true);

  // Create vehicle icon element
  const createVehicleElement = (heading: number = 0) => {
    const el = document.createElement('div');
    el.className = 'vehicle-marker';
    el.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background: hsl(var(--primary));
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(${heading}deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid white;
          margin-top: -2px;
        "></div>
      </div>
    `;
    return el;
  };

  // Create home icon element
  const createHomeElement = () => {
    const el = document.createElement('div');
    el.className = 'home-marker';
    el.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: hsl(var(--success));
        border: 2px solid white;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 1px;
        "></div>
      </div>
    `;
    return el;
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // You'll need to add your Mapbox token
    mapboxgl.accessToken = 'pk.your-mapbox-token-here';
    
    // Default to center if no position
    const defaultLat = currentPosition?.latitude || homePosition?.latitude || 39.8283;
    const defaultLng = currentPosition?.longitude || homePosition?.longitude || -98.5795;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [defaultLng, defaultLat],
      zoom: currentPosition ? 15 : 10,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Wait for map to load before adding sources and layers
    map.current.on('load', () => {
      // Add flight path source
      map.current?.addSource('flightPath', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      // Add flight path layer
      map.current?.addLayer({
        id: 'flightPath',
        type: 'line',
        source: 'flightPath',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
    });

    // Cleanup
    return () => {
      vehicleMarker.current?.remove();
      homeMarker.current?.remove();
      map.current?.remove();
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Update home position
  useEffect(() => {
    if (map.current && homePosition && homePosition.set) {
      if (homeMarker.current) {
        homeMarker.current.remove();
      }
      
      homeMarker.current = new mapboxgl.Marker({
        element: createHomeElement()
      })
        .setLngLat([homePosition.longitude, homePosition.latitude])
        .addTo(map.current);
    }
  }, [homePosition]);

  // Update vehicle position
  useEffect(() => {
    if (map.current && currentPosition) {
      // Update or create vehicle marker
      if (vehicleMarker.current) {
        vehicleMarker.current.setLngLat([currentPosition.longitude, currentPosition.latitude]);
        // Update heading
        const element = vehicleMarker.current.getElement();
        const markerDiv = element.querySelector('.vehicle-marker > div') as HTMLElement;
        if (markerDiv) {
          markerDiv.style.transform = `rotate(${currentPosition.heading || 0}deg)`;
        }
      } else {
        vehicleMarker.current = new mapboxgl.Marker({
          element: createVehicleElement(currentPosition.heading || 0)
        })
          .setLngLat([currentPosition.longitude, currentPosition.latitude])
          .addTo(map.current);
      }

      // Follow vehicle if enabled
      if (followVehicle) {
        map.current.flyTo({
          center: [currentPosition.longitude, currentPosition.latitude],
          duration: 1000
        });
      }
    }
  }, [currentPosition, followVehicle]);

  // Update flight path
  useEffect(() => {
    if (map.current && map.current.getSource('flightPath') && flightPath.length > 0) {
      const coordinates = flightPath.map(pos => [pos.longitude, pos.latitude]);
      
      (map.current.getSource('flightPath') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
    }
  }, [flightPath]);

  const toggleMapStyle = () => {
    setMapStyle(current => 
      current === 'mapbox://styles/mapbox/dark-v11' 
        ? 'mapbox://styles/mapbox/satellite-v9'
        : current === 'mapbox://styles/mapbox/satellite-v9'
        ? 'mapbox://styles/mapbox/outdoors-v12'
        : 'mapbox://styles/mapbox/dark-v11'
    );
  };

  const centerOnVehicle = () => {
    if (map.current && currentPosition) {
      map.current.flyTo({
        center: [currentPosition.longitude, currentPosition.latitude],
        zoom: 16,
        duration: 1000
      });
    }
  };

  const centerOnHome = () => {
    if (map.current && homePosition && homePosition.set) {
      map.current.flyTo({
        center: [homePosition.longitude, homePosition.latitude],
        zoom: 16,
        duration: 1000
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleMapStyle}
          className="bg-background/90 backdrop-blur-sm"
        >
          <Layers className="w-4 h-4" />
        </Button>
        
        {currentPosition && (
          <Button
            variant={followVehicle ? "default" : "secondary"}
            size="sm"
            onClick={() => setFollowVehicle(!followVehicle)}
            className="bg-background/90 backdrop-blur-sm"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        )}

        {currentPosition && (
          <Button
            variant="secondary"
            size="sm"
            onClick={centerOnVehicle}
            className="bg-background/90 backdrop-blur-sm"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        )}

        {homePosition?.set && (
          <Button
            variant="secondary"
            size="sm"
            onClick={centerOnHome}
            className="bg-background/90 backdrop-blur-sm"
          >
            <Home className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Flight Data Overlay */}
      {currentPosition && (
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-sm">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Alt:</span>
              <span className="ml-1 font-mono">{currentPosition.altitude.toFixed(1)}m</span>
            </div>
            <div>
              <span className="text-muted-foreground">Spd:</span>
              <span className="ml-1 font-mono">{currentPosition.speed.toFixed(1)}m/s</span>
            </div>
            <div>
              <span className="text-muted-foreground">Hdg:</span>
              <span className="ml-1 font-mono">{currentPosition.heading.toFixed(0)}°</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pos:</span>
              <span className="ml-1 font-mono">
                {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Data Overlay */}
      {!currentPosition && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Waiting for position data...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightMap;