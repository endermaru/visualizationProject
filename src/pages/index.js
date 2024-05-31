import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [visible, setVisible] = useState(true);

  

  const lat_init = 37.55220205704455;
  const lng_init = 126.974485672578;
  const bear_init = -92.40525969468547;
  const pitch_init = 61.5;
  const zoom_init = 15.605997843300576;

  
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/endermaru/clw7k3lp201gl01ob8hri10ur',
      center: [126.97455993492207,37.552101067213684],
      zoom: 16.899083437364837,
      pitch: 48.500000000000036,
      bearing:  -94.47041015628895,
      maxZoom: 18,
      minZoom: 15,
      attributionControl: false
    });

    map.current.on('load', () => {
      const delay = 2000;
      setTimeout(() => {
        map.current.flyTo({
          center: [lng_init,lat_init],
          zoom: zoom_init,
          pitch: pitch_init,
          bearing: bear_init,
          essential: true,
          duration:2000
        });
        map.current.dragPan.disable();
        map.current.once('moveend', () => {
          map.current.dragPan.enable();
        });
      }, delay);
    });

    //Valid others
    map.current.on('click', 'valid_others', (e) => {
      let address = e.features[0].properties.address.slice(5,);
      new mapboxgl.Popup({className: 'popup-valid-others'})
        .setLngLat(e.lngLat)
        .setHTML(`
        <div style="color:white;">
          일반 주거용 건물
        </div>
        <div style="color:white;font-size:15px;font-weight: bold;margin-bottom:7px;width:100%;">
          ${address}
        </div>
        <hr style="border-color: white;"> 
        <div style="color:white;font-weight: bold;font-size:15px;margin-top:7px">
          폭염 불평등 지수: ${Math.round(e.features[0].properties.score*10)/10}점
        </div>`)
        .addTo(map.current);
    });
    map.current.on('mouseenter', 'valid_others', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'valid_others', () => {
      map.current.getCanvas().style.cursor = '';
    });

    //Valid target
    map.current.on('click', 'valid_target', (e) => {
      let address = e.features[0].properties.address.slice(5,);
      new mapboxgl.Popup({className: 'popup-valid-target'})
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="color:white;">
            쪽방촌 건물
          </div>
          <div style="color:white;font-size:15px;font-weight: bold;margin-bottom:7px;width:100%;">
            ${address}
          </div>
          <hr style="border-color: white;"> 
          <div style="color:white;font-weight: bold;font-size:15px;margin-top:7px">
            폭염 불평등 지수: ${Math.round(e.features[0].properties.score*10)/10}점
          </div>`)
        .addTo(map.current);
    });
    

    
    map.current.on('mouseenter', 'valid_target', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'valid_target', () => {
      map.current.getCanvas().style.cursor = '';
    });

    map.current.on('move',(e)=>{
      const center = map.current.getCenter(); 
      const bearing = map.current.getBearing();
      const zoom = map.current.getZoom();
      const pitch = map.current.getPitch();

      console.log('Current center:', center);
      console.log('Current bearing:', bearing);
      console.log('Current zooom', zoom);
      console.log('Current Pitch', pitch);
    })
    // Reset button functionality
    document.getElementById('reset').addEventListener('click', () => {
      map.current.flyTo({
        center: [lng_init,lat_init],
        zoom: zoom_init,
        pitch: pitch_init,
        bearing: bear_init,
        essential: true
      });
    });

    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());
    
  });

  const visibleToggle = (e)=>{
    const popup = document.getElementsByClassName('mapboxgl-popup');
    if (popup.length) {
      popup[0].remove();
    }
    // Toggle layer visibility by changing the layout object's visibility property.
    if (visible) {
      map.current.setLayoutProperty('valid_others', 'visibility', 'none');
    } else {
      map.current.setLayoutProperty('valid_others', 'visibility', 'visible');
    }
    setVisible(!visible);
  }

  const [showImage, setShowImage] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(false);
    }, 3000); //delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-black h-screen w-screen flex items-center">
      {showImage && <div className="image bg-black absolute h-full w-full">
        <img src="/dongja.png" className="image"/>
        </div>}
      <div className="absolute flex flex-col z-10 top-36 right-0 px-1 rounded-md">
        <button className={`rounded-md p-1 m-1 aspect-square border border-1 border-black bg-white font-bold text-stone-700 hover:text-blue-600`
        } onClick={(e)=>visibleToggle(e)}>
          <p className="text-2xl">{!visible? "🗺️":"🔍"}</p>
          <p className="text-xs">{!visible? "다른건물":"쪽방촌만"}</p>
          <p className="text-xs">{!visible? "둘러보기":"살펴보기"}</p>
        </button>
        <button className="parent rounded-md p-1 m-1 aspect-square border border-1 border-black bg-white hover:bg-white font-bold text-stone-700 hover:text-blue-600" id="reset">
          <p className="text-2xl rotate-on-hover">↻</p>
          <p className="text-xs">처음으로</p>
        </button>
      </div>
      <div className="z-0" ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
    </main>
  );
}