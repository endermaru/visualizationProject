import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapB, {coord} from './map'

export default function Home() {

  //Map 컴포넌트 통신용
  const [action, setAction] = useState('null');
  
  const [lat, setLat] = useState(coord.init.lat);
  const [lng, setLng] = useState(coord.init.lng);
  const [bearing,setBearing] = useState(coord.init.bearing);
  const [pitch, setPitch] = useState(coord.init.pitch);
  const [zoom, setZoom] = useState(coord.init.zoom);
 
  const mapAction = () => {
    if (action!='null'){
      setLat(coord.init.lat);
      setLng(coord.init.lng);
      setBearing(coord.init.bearing);
      setPitch(coord.init.pitch);
      setZoom(coord.init.zoom);
    } else {
      setLat(coord.center.lat);
      setLng(coord.center.lng);
      setBearing(coord.center.bearing);
      setPitch(coord.center.pitch);
      setZoom(coord.center.zoom);
    }
    setAction(action=='center'? 'null':'center'); //토글되며 액션 실행
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
      {/* 여기까지 */}
      
    </main>
  );
}