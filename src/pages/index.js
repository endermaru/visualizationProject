import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && typeof window !== 'undefined') {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
      });

      // Add additional map setup or event listeners here
      return () => map.remove();
    }
  }, []);

  return (
    <main className="bg-black min-h-screen flex items-center border-2 border-rose-500">
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
    </main>
  );
}