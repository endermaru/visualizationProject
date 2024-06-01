import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapB from './map'

export default function Home() {

  //Map 컴포넌트 통신용
  const [action, setAction] = useState(0);
  const [lat, setLat] = useState(37.55);
  const [lng, setLng] = useState(126.97);
  const [bearing,setBearing] = useState(-92.4);
  const [pitch, setPitch] = useState(61.5);
  const [zoom, setZoom] = useState(15.6);
 
  const mapAction = () => {
    setAction(action? 0:1); //토글되며 액션 실행
  };

  return (
    <main className="bg-black h-screen w-screen flex items-center">
      
      <MapB action={action} lat={lat} lng={lng}
      pitch={pitch} bearing={bearing} zoom={zoom} />
      {/* 컴포넌트가 맵 밑에서 안 보인다면, z인덱스 활용! (순서대로 차곡차곡 위에 렌더링)*/}


      {/*사용 예시*/}
      <button className="absolute bg-white text-black" onClick={mapAction}>
        Trigger Map Action
      </button>
      <button className="absolute bg-white text-black top-0" onClick={()=>{
        setLat(lat+0.005);
      }}>
        adjust lat
      </button>
      {/* 여기까지 */}


      
    </main>
  );
}