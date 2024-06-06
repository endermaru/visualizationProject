import { useEffect, useState, useRef } from 'react';
import MapB from './components/map'

const scrollLocation ={
  0:0,
  1:1500,
  2:3000,
}

export default function Home() {

  useEffect(() => {
    window.scrollTo({top: 0}); // 페이지 상단으로 스크롤
    setAction(0);
  }, []);

  //Map 컴포넌트 통신용
  const [action, setAction] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    let timer;
    const handleWheel = (event) => {
      event.preventDefault();
      if (loaded && !interactive && !isScrolling) {
        const direction = event.deltaY;
        if (direction > 0) { // 아래로
          window.scrollTo({
            top: scrollLocation[action + 1],
            behavior: 'smooth'
          });
          setAction(action<14? action + 1:14);
        } else if (direction < 0) {
          window.scrollTo({
            top: scrollLocation[action - 1],
            behavior: 'smooth'
          });
          setAction(action > 0 ? action - 1 : 0);
        }
        setIsScrolling(true);
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000); // 현재는 1초로 설정되어 있지만 필요에 따라 조절할 수 있습니다.
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [action, isScrolling, interactive,loaded]);

  const getInfo= (isInteractive, isLoaded)=>{
    setInteractive(isInteractive);
    setLoaded(isLoaded);
  }

  return (
    <main className="font-Pretendard-Regular scroll-smooth" style={{ height: '20000px' }}>
      <MapB 
        action={action}
        getInfo={getInfo}
      />
      <div className="relative z-10 ">
        
        {/* 커버 */}
        <div className="relative faded-bottom overflow-hidden">
          <img className="w-screen object-cover overflow-hidden grow-animation" src="cover.png" alt="Cover Image" />
          <div className="absolute text-white top-0 left-0 flex flex-col text-left ml-[150px]">
            <p className='mt-[250px] text-6xl'>더위는 모두에게 평등한가</p>
            <p className="mt-[100px] text-8xl font-Pretendard-ExBold">동자동 폭염 불평등 지도로 보는<br/>여름의 비극</p>
            <p className='mt-[250px] text-2xl'>{"*본 프로젝트는 한국일보, <도시 빈자들의 최후의 주거지 - 지옥고 아래 쪽방>을 데이터 시각화로서 재구성한 프로젝트입니다."}</p>
          </div>
        </div>

        <div className="mt-[550px] h-screen text-white flex justify-center relative">
            <div className="w-[924px] h-[70px] bg-black rouded-full faded-elipse"></div>
            <p className='absolute font-Pretendard-ExBold text-6xl'>서울시에는 크게 네 군데의 쪽방촌이 있다.</p>
        </div>

        <div className="mt-4 flex flex-col">
          
          {/* <UIComponent className="z-20"/>
          <div className="h-96 bg-gray-300 mb-4">Scrollable Content 2</div>
          <div className="h-96 bg-gray-400 mb-4">Scrollable Content 3</div>
          <div className="h-96 bg-gray-500 mb-4">Scrollable Content 4</div> */}
        </div>
      </div>
    </main>

  );
}