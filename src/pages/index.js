import { useEffect, useState, useRef } from "react";
import MapB from "./components/map";

export default function Home() {
  const [pageHeight, setPageHeight] = useState(0);
  const maxPage = 2; // 예: 페이지 수가 5개로 늘어났다고 가정

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageHeight(window.innerHeight);

      const handleResize = () => {
        setPageHeight(window.innerHeight);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const scrollLocation = {};
  for (let i = 0; i <= maxPage; i++) {
    scrollLocation[i] = i * pageHeight;
  }

  //Map 컴포넌트 통신용
  const [action, setAction] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let timer;

      const handleWheel = (event) => {
        event.preventDefault();
        if (loaded && !interactive && !isScrolling) {
          const direction = event.deltaY;
          // if (direction > 0) { // 아래로
          //   window.scrollTo({
          //     top: scrollLocation[action + 1],
          //     behavior: 'smooth'
          //   });
          //   setAction(action<2? action + 1:2);
          // } else if (direction < 0) {
          //   window.scrollTo({
          //     top: scrollLocation[action - 1],
          //     behavior: 'smooth'
          //   });
          //   setAction(action > 0 ? action - 1 : 0);
          // }
          setIsScrolling(true);

          setAction((prevAction) => {
            const newAction =
              direction > 0
                ? Math.min(prevAction + 1, maxPage)
                : Math.max(prevAction - 1, 0);
            window.scrollTo({
              top: scrollLocation[newAction],
              behavior: "smooth",
            });
            return newAction;
          });

          setTimeout(() => {
            setIsScrolling(false);
          }, 1000); // 현재는 1초로 설정되어 있지만 필요에 따라 조절할 수 있습니다.
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        window.removeEventListener("wheel", handleWheel);
        if (timer) clearTimeout(timer);
      };
    }
  }, [action, loaded, interactive, isScrolling, pageHeight, scrollLocation]);

  const getInfo = (isInteractive, isLoaded) => {
    setInteractive(isInteractive);
    setLoaded(isLoaded);
  };

  return (
    <main
      className="font-Pretendard-Regular scroll-smooth"
      style={{ height: "20000px" }}
    >
      <MapB action={action} getInfo={getInfo} />
      <div className="relative z-10 ">
        {/* 커버 */}
        <div className="relative faded-bottom overflow-hidden">
          <img
            className="w-screen h-screen object-cover overflow-hidden grow-animation"
            src="cover.png"
            alt="Cover Image"
          />
          <div className="absolute text-white top-0 left-0 flex flex-col text-left md:ml-[10%] ml-[5%]">
            <p className="mt-[20vh] text-4xl md:text-6xl">
              더위는 모두에게 평등한가
            </p>
            <p className="mt-[5vh] text-6xl md:text-8xl font-Pretendard-ExBold">
              동자동 폭염 불평등 지도로 보는
              <br />
              여름의 비극
            </p>
            <p className="mt-[20vh] text-xl md:text-2xl">
              {
                "*본 프로젝트는 한국일보, <도시 빈자들의 최후의 주거지 - 지옥고 아래 쪽방>을 데이터 시각화로서 재구성한 프로젝트입니다."
              }
            </p>
          </div>
        </div>

        <div className="mt-[50vh] h-screen text-white flex justify-center relative">
          {/* <img
            className="w-screen h-screen object-cover overflow-hidden grow-animation"
            src="cover.png"
            alt="Cover Image"
          /> */}
          <div className="w-[90%] md:w-[50%] h-[10vh] bg-black rounded-full faded-elipse"></div>
          <p className="absolute font-Pretendard-ExBold text-4xl md:text-6xl text-center">
            서울시에는 크게 네 군데의 쪽방촌이 있다.
          </p>
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
