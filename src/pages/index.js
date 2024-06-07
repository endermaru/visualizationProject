import { useEffect, useState, useRef } from "react";
import MapB from "./components/map";

export default function Home() {
  const [pageHeight, setPageHeight] = useState(0);
  const maxPage = 14; // 예: 페이지 수가 5개로 늘어났다고 가정

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
    document.querySelectorAll("p").forEach((p) => {
      // 이미 line-wrapper가 있는 경우 무시합니다.
      if (p.querySelector(".line-wrapper")) {
        //console.log("Element already processed, skipping:", p);
        return;
      }

      // console.log("Found <p> element:", p); // <p> 요소가 있는지 확인
      const text = p.innerHTML;
      // console.log("Original text:", text); // 기존 텍스트를 출력
      p.innerHTML = ""; // 기존 텍스트를 제거합니다.

      // 줄 바꿈 기준으로 텍스트를 나눕니다.
      const lines = text.split("<br>");

      lines.forEach((line, index) => {
        const span = document.createElement("span");
        span.innerHTML = line;
        span.classList.add("line-wrapper");

        // console.log("Creating <span> for line:", line); // 각 줄에 대해 <span> 생성 여부 확인
        p.appendChild(span);

        // 줄 바꿈을 추가합니다 (마지막 줄 제외).
        if (index < lines.length - 1) {
          p.appendChild(document.createElement("br"));
        }
      });

      // console.log("Final HTML structure:", p.innerHTML); // 최종 <p> 구조 확인
    });

    if (typeof window !== "undefined") {
      let timer;

      const handleWheel = (event) => {
        event.preventDefault();
        if (loaded && !interactive && !isScrolling) {
          const direction = event.deltaY;
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
      <div className="relative z-10">
        {/* 커버 */}
        <div className="cover w-screen h-screen faded-bottom overflow-hidden">
          {/*<img
            className="w-screen h-screen object-cover overflow-hidden grow-animation"
            src="cover.png"
            alt="Cover Image"
          />*/}
          <div>
            <div className="absolute text-white top-0 left-0 flex flex-col text-left md:ml-[10%] ml-[5%]">
              <p className="mt-[20vh] text-[6vmin]">더위는 모두에게 평등한가</p>
              <p className="mt-[5vh] text-[8vmin] leading-tight font-Pretendard-ExBold">
                동자동 폭염 불평등 지도로 보는
                <br />
                여름의 비극
              </p>
            </div>
            <p className="absolute text-white bottom-[20vh] text-left text-[2.7vmin] md:ml-[10%] mr-[10%] ml-[5%]">
              {
                "*본 프로젝트는 한국일보, <도시 빈자들의 최후의 주거지 - 지옥고 아래 쪽방>을 데이터 시각화로서 재구성한 프로젝트입니다."
              }
            </p>
          </div>
        </div>

        <div className="attach-image w-screen h-screen faded-both text-white flex justify-center items-center relative">
          {/* <img
            className="w-screen faded-top faded-bottom h-screen object-cover overflow-hidden grow-animation"
            src="background.png"
            alt="Background Image"
          />*/}
          <p className="absolute font-Pretendard-ExBold text-[5vmin] text-center">
            매년 다가오는 여름은 쪽방촌 주민들에게 치명적인 위협이다.
          </p>
        </div>
        <p className="absolute font-Pretendard-ExBold text-[5vmin] text-center">
          KBS의 보도 자료에 따르면, 한여름 쪽방촌의 표면 온도는 아파트에 비해
          30도 가량 높았다.
        </p>

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
