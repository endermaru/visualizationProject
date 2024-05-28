import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapContainerRef = useRef(null);

  let map;

  useEffect(() => {
    if (mapContainerRef.current && typeof window !== 'undefined') {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/endermaru/clw7k3lp201gl01ob8hri10ur',
        center: [126.973,37.545],
        zoom: 16,
        pitch:60,
        bearing:-30,
        attributionControl: false
      });

      // Add additional map setup or event listeners here
      return () => map.remove();
    }
    console.log(map.setLayoutProperty())
  }, []);

  return (
    <main className="bg-black h-screen w-screen flex items-center border-2 border-rose-500">
      <div className="bg-white absolute h-screen w-96 drop-shadow-2xl top-0 left-0 p-4 z-10">
        <button className="border border-black shadow-2xl shadow-black" onClick={(e)=>{
          e.preventDefault();
          const clickedLayer1 = 'valid_others'
          const clickedLayer2 = 'score_others'
          const visibility1 = map.getLayoutProperty(
            clickedLayer1,
            'visibility'
          )
          const visibility2 = map.getLayoutProperty(
            clickedLayer2,
            'visibility'
          )

          // Toggle layer visibility by changing the layout object's visibility property.
          if (visibility1 === 'visible') {
            map.setLayoutProperty(clickedLayer1, 'visibility', 'none');
          } else {
              map.setLayoutProperty(
                  clickedLayer1,
                  'visibility',
                  'visible'
              );
          }

          if (visibility2 === 'visible') {
            map.setLayoutProperty(clickedLayer2, 'visibility', 'none');
          } else {
              map.setLayoutProperty(
                  clickedLayer2,
                  'visibility',
                  'visible'
              );
          }

        }}>"click me"</button>
      </div>
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
    </main>
  );
}