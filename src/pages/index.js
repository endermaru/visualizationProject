import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapB, {coord} from './components/map'
import UIComponent from './components/UIComponents';

export default function Home() {

  //Map 컴포넌트 통신용
  const [action, setAction] = useState(0);
  const [lat, setLat] = useState(coord.init.lat);
  const [lng, setLng] = useState(coord.init.lng);
  const [bearing,setBearing] = useState(coord.init.bearing);
  const [pitch, setPitch] = useState(coord.init.pitch);
  const [zoom, setZoom] = useState(coord.init.zoom);
 
  const mapAction = (newAction) => { //페이즈를 분리해 맞게 작동할 수 있도록
    const act = newAction;
    switch(act){
      case 0:{
        setLat(coord.init.lat);
        setLng(coord.init.lng);
        setBearing(coord.init.bearing);
        setPitch(coord.init.pitch);
        setZoom(coord.init.zoom);
        break;
      }
      case 1:{
        setLat(coord.center.lat);
        setLng(coord.center.lng);
        setBearing(coord.center.bearing);
        setPitch(coord.center.pitch);
        setZoom(coord.center.zoom);
        break;
      }
    }
    setAction(newAction); //토글되며 액션 실행
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 2200) {
        console.log('Scroll position is more than 300px');
        // 여기서 특정한 액션을 수행
        mapAction(1);
      } else {
        mapAction(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="font-Pretendard-Regular" style={{ height: '20000px' }}>
      
      <MapB 
        action={action} 
        lat={lat} 
        lng={lng} 
        pitch={pitch} 
        bearing={bearing} 
        zoom={zoom} 
      />
      <div className="relative z-10">
        {/* 커버 */}

        <div className="bg-white text-black h-48 flex items-center" style={{ height: '957px' }}>
          <p>Scroll down to see more content</p>
        </div>
        <div className="mt-4 flex flex-col">
          {/* <button className="z-5 bg-white text-black" onClick={mapAction}>
              Trigger Map Action
          </button> */}
          <div className="h-96 bg-gray-200 mb-4 flex items-center PretendardVariable" style={{ marginTop: '957px' }}>
            <p className='font-Pretendard-ExBold'>더 내리세요</p>
            
          </div>
          <UIComponent className="z-20"/>
          {/* <div className="h-96 bg-gray-300 mb-4">Scrollable Content 2</div>
          <div className="h-96 bg-gray-400 mb-4">Scrollable Content 3</div>
          <div className="h-96 bg-gray-500 mb-4">Scrollable Content 4</div> */}
        </div>
      </div>
    </main>

  );
}