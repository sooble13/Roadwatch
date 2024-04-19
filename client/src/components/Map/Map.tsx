import { useEffect } from 'react';
import styles from './Map.module.scss';
import { useGetMarkersQuery } from '@/store';
import cone from '../../assets/markers/Cone.svg';
import pothole from '../../assets/markers/Pothole.svg';
import roadDamage from '../../assets/markers/RoadDamage.svg';
import carAccident from '../../assets/markers/CarAccident.svg';
import warning from '../../assets/markers/WarningSign.svg';

// Initialize initMap as a global function
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  location: Location;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const { data: markers } = useGetMarkersQuery();

  const parser = new DOMParser();

  const coneSvg = parser.parseFromString(cone, 'image/svg+xml').documentElement;
  const potholeSvg = parser.parseFromString(pothole, 'image/svg+xml').documentElement;
  const roadDamageSvg = parser.parseFromString(roadDamage, 'image/svg+xml').documentElement;
  const carAccidentSvg = parser.parseFromString(carAccident, 'image/svg+xml').documentElement;
  const warningSvg = parser.parseFromString(warning, 'image/svg+xml').documentElement;

  useEffect(() => {
    const initMap = async () => {
      // Ensure the Google Maps API script has loaded
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API script not loaded yet.');
        return;
      }

      // Use the location prop for setting the map center and marker
      const position = { lat: location.lat, lng: location.lng };

      // Import the Google Maps library and AdvancedMarkerElement
      const { Map } = await window.google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

      // Map initialization
      const map = new Map(document.getElementById('map'), {
        zoom: 15,
        center: position,
        mapId: 'ROADWATCH_MAP_ID',
      });

      //Test marker
      new AdvancedMarkerElement({
        map: map,
        position: position,
        title: 'Test Marker',
      });

      // Check if markers exist and are an array
      if (Array.isArray(markers)) {
        // Your existing map initialization code...
        markers.forEach((marker) => {
          new AdvancedMarkerElement({
            map: map,
            position: { lat: marker.latitude, lng: marker.longitude },
            title: marker.type,
          });
        });
      }
    };

    // Dynamically load the Google Maps script
    const loadGoogleMapsScript = () => {
      const scriptId = 'google-maps-script';

      // Check if the script is already loaded or if the script tag already exists
      if (window.google && window.google.maps) {
        window.initMap();
        return;
      } else if (!document.getElementById(scriptId)) {
        // Only proceed to add the script if it doesn't already exist
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;

        script.onerror = () => console.error('Google Maps script failed to load.');

        document.head.appendChild(script);
      }
      window.initMap = initMap;
    };

    loadGoogleMapsScript();
  }, [location]); // Dependency array to re-run the effect if the location prop changes

  return <div id="map" className={styles['mapContainer']}></div>;
};

export default Map;
