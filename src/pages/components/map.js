import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const coord = {
  //seoul
  0:{
    lat:35.96595983935754,
    lng:127.52614094993498,
    bearing: 0,
    pitch: 0,
    zoom: 6.494604866073363
  },
  4:{
    lat:35.96595983935754,
    lng:127.52614094993498,
    bearing: 0,
    pitch: 0,
    zoom: 6.494604866073363
  },
  5:{
    lat:37.56786346227889,
    lng:126.9756051435611,
    bearing: 0,
    pitch: 0,
    zoom: 10.717126200821815
  },
  6:{
    lat:37.55133914078637,
    lng:126.9757847023518,
    bearing: 0,
    pitch: 53.54040022453836,
    zoom: 15.527706568294564
  },
  7:{
    lat:37.55310914423893,
    lng:126.97491374080454,
    bearing: -106.09379619305673,
    pitch: 47.032349695931806,
    zoom: 17.101811485926945
  },
}

//for markers
const geojson = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [126.954736, 37.596085]
      },
      'properties': {
        'title': 'donui',
        'marker':'marker1'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [127.048062,37.550729]
      },
      'properties': {
        'title': 'changsin',
        'marker':'marker2'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [126.945137,37.519535]
      },
      'properties': {
        'title': 'dongja',
        'marker':'marker3'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [126.875724,37.540448]
      },
      'properties': {
        'title': 'yeongdeungpo',
        'marker':'marker4'
      }
    }
  ]
};

const MapB =(props) => {
  const mapContainer = useRef(null); //맵 컨테이너 객체
  const map = useRef(null); //맵 객체
  const [visible, setVisible] = useState(true); //기타 건물 표시 여부
  const [interactive, setInteractive] = useState(false);
  const [tool, setTool] = useState(true);
  const markers = useRef([]); //마커 관리
  const [pastAction, setAction]=useState(0);
  const [loaded, setLoaded] = useState(false);
  
  //useEffect for mapbox
  useEffect(() => {
    //init
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/endermaru/clw7k3lp201gl01ob8hri10ur',
      center: [coord['0'].lng,coord['0'].lat],
      zoom: coord['0'].zoom,
      pitch: coord['0'].pitch,
      bearing: coord['0'].bearing,

    });

    map.current.on('style.load',()=>{
      setLoaded(true);
      props.getInfo(interactive,true);
    })
    //load - 레이어 표시 및 쪽방촌 마커 추가
    map.current.on('style.load', () => {
      map.current.setLayoutProperty('seoul1', 'visibility', 'visible');
      map.current.setLayoutProperty('seoul2', 'visibility', 'visible');
      
      // for (const feature of geojson.features) {
      //   const el = document.createElement('div');
      //   el.className = "marker";
      //   el.id = feature.properties.marker;
      //   const marker = new mapboxgl.Marker(el)
      //     .setLngLat(feature.geometry.coordinates)
      //     .addTo(map.current);
      //   markers.current.push(marker);
      // }
    });

    //팝업
    //Valid others
    map.current.on('click', 'valid_others', (e) => {
      let address = e.features[0].properties.address.slice(5,);
      new mapboxgl.Popup({className: 'popup-valid-others'})
        .setLngLat(e.lngLat)
        .setHTML(`
        <div style="color:white;font-size:13px;">
          일반 주거용 건물
        </div>
        <div style="color:white;font-size:17px;font-weight: bold;margin-bottom:7px;width:100%;">
          ${address}
        </div>
        <hr style="border-color: white;"> 
        <div style="color:white;font-weight: bold;font-size:17px;margin-top:7px">
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
          <div style="color:white;font-size:13px;">
            쪽방촌 건물
          </div>
          <div style="color:white;font-size:17px;font-weight: bold;margin-bottom:7px;width:100%;">
            ${address}
          </div>
          <hr style="border-color: white;"> 
          <div style="color:white;font-weight: bold;font-size:17px;margin-top:7px">
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

    //실시간 좌표 출력
    // map.current.on('move',(e)=>{
    //   const center = map.current.getCenter(); 
    //   const bearing = map.current.getBearing();
    //   const zoom = map.current.getZoom();
    //   const pitch = map.current.getPitch();

    //   console.log('Current center:', center);
    //   console.log('Current bearing:', bearing);
    //   console.log('Current Pitch', pitch);
    //   console.log('Current zooom', zoom);
    // });
    
    //map.current.addControl(new mapboxgl.NavigationControl())
  });

  //action - index와 통신
  useEffect(() => {
    let timer;
    console.log("props.action:",props.action);
    

    //이동
    if (loaded && !interactive) {
      if (props.action>=4) {
        map.current.flyTo({
          duration : 1000,
          center: [coord[props.action].lng, coord[props.action].lat],
          zoom: coord[props.action].zoom,
          pitch: coord[props.action].pitch,
          bearing: coord[props.action].bearing,
          essential: true,
        });
      }
      // 단계별 메서드
      switch(props.action){
        case 7:{
          map.current.setLayoutProperty('valid_others_inactive', 'visibility', 'visible');
          map.current.setLayoutProperty('valid_others', 'visibility', 'none');
          map.current.setLayoutProperty('valid_target_icon', 'visibility', 'none');
          setVisible(false);
          break;
        }
        case 6:{
          // 레이어 비활성화 및 마커 제거
          markers.current.forEach(marker => {
            const markerElement = marker.getElement();
            // markerElement.classList.add('fade-out');
            markerElement.addEventListener('animationend', () => {
              marker.remove();
            });
          });
          markers.current = [];
          map.current.setLayoutProperty('seoul1', 'visibility', 'none');
          map.current.setLayoutProperty('seoul2', 'visibility', 'none');
          map.current.setLayoutProperty('valid_others_inactive', 'visibility', 'none');
          map.current.setLayoutProperty('valid_others', 'visibility', 'visible');
          map.current.setLayoutProperty('valid_target_icon', 'visibility', 'visible');
          setVisible(true);
          break;
        }
        case 5:{
          setTimeout(()=>{
            map.current.setLayoutProperty('seoul1', 'visibility', 'visible');
            map.current.setLayoutProperty('seoul2', 'visibility', 'visible');
            map.current.setLayoutProperty('valid_others', 'visibility', 'visible');
            if (markers.current.length==0) {
              for (const feature of geojson.features) {
                const el = document.createElement('div');
                el.className = "marker fade-out";
                el.id = feature.properties.marker;
                const marker = new mapboxgl.Marker(el)
                  .setLngLat(feature.geometry.coordinates)
                  .addTo(map.current);
                markers.current.push(marker);
              }
            }
          },500);
          
          break;
        }
        case 4:{
          // 레이어 비활성화 및 마커 제거
          if (markers.current.length!=0){
            console.log("!!");
            markers.current.forEach(marker => {
              const markerElement = marker.getElement();
              // markerElement.classList.add('fade-out');
              markerElement.addEventListener('animationend', () => {
                marker.remove();
              });
            });
            markers.current = [];
          }
          break; 
        }
        
      }
      console.log("marker length:",markers.current.length);
    }
    setAction(props.action);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [props.action, visible, markers]); 

  //팝업 지우기
  const removePopups = ()=> {
    const popup = document.getElementsByClassName('mapboxgl-popup');
    if (popup.length) {
      popup[0].remove();
    }
  } 

  //기타 건물 활성화, 비활성화
  const visibleToggle = (e)=>{
    removePopups();
    // Toggle layer visibility by changing the layout object's visibility property.
    if (visible) {
      map.current.setLayoutProperty('valid_others_inactive', 'visibility', 'visible');
      map.current.setLayoutProperty('valid_others', 'visibility', 'none');
      map.current.setLayoutProperty('valid_target_icon', 'visibility', 'none');
    } else {
      map.current.setLayoutProperty('valid_others', 'visibility', 'visible');
      map.current.setLayoutProperty('valid_others_inactive', 'visibility', 'none');
      map.current.setLayoutProperty('valid_target_icon', 'visibility', 'visible');
    }
    setVisible(!visible);
  }

  //맵 상호작용 토글
  useEffect(()=>{
    removePopups();
    if (map.current) {
      if (interactive){
        map.current['scrollZoom'].enable();
        map.current['boxZoom'].enable();
        map.current['dragRotate'].enable();
        map.current['dragPan'].enable();
        map.current['keyboard'].enable();
        map.current['doubleClickZoom'].enable();
        map.current['touchZoomRotate'].enable();
      } else {
        map.current['scrollZoom'].disable();
        map.current['boxZoom'].disable();
        map.current['dragRotate'].disable();
        map.current['dragPan'].disable();
        map.current['keyboard'].disable();
        map.current['doubleClickZoom'].disable();
        map.current['touchZoomRotate'].disable();
      }
    }
    props.getInfo(interactive,loaded);
  },[interactive]);

  return (
    <div className='fixed top-0 left-0 w-screen h-screen z-0'>
      
      <div className='z-0' ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
      {tool && <div className="absolute flex flex-col z-10 top-4 right-4 px-1 rounded-md font-Pretendard-ExBold">
        <button className={`rounded-md p-1 m-1 aspect-square border border-1 border-black bg-white font-bold text-stone-700 hover:text-blue-600`
        } onClick={(e)=>visibleToggle(e)}>
            <p className="text-xl">{!visible? "🗺️":"🔍"}</p>
            <p className="text-xs">{!visible? "다른건물":"쪽방촌만"}</p>
            <p className="text-xs">{!visible? "둘러보기":"살펴보기"}</p>
        </button>
        <button className={`rounded-md p-1 m-1 aspect-square border border-1 border-black bg-white font-bold text-stone-700 hover:text-blue-600`
        } onClick={(e)=>setInteractive(!interactive)}>
            <p className="text-xs">상호작용</p>
            <p className="text-lg">{interactive? "ON":"OFF"}</p>
        </button>
        <button className="rounded-md p-1 m-1 aspect-square border border-1 border-black bg-white hover:bg-white font-bold text-stone-700 hover:text-blue-600" id="reset"
        onClick={()=>{
          removePopups();
          map.current.flyTo({
            center: [coord[2].lng,coord[2].lat],
            zoom: coord[2].zoom,
            pitch: coord[2].pitch,
            bearing: coord[2].bearing,
            essential: true
          });
        }}>
            <p className="text-xs">처음으로</p>
            <p className="text-2xl font-bold">↻</p>
        </button>
      </div>}
    </div>
  );
}

export default MapB;