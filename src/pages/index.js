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

  // 기존 useEffect 내용 중 line-wrapper 관련 부분
  useEffect(() => {
    document.querySelectorAll("p").forEach((p) => {
      if (p.querySelector(".line-wrapper")) {
        return;
      }

      const text = p.innerHTML;
      p.innerHTML = "";

      const lines = text.split("<br>");

      lines.forEach((line, index) => {
        const span = document.createElement("span");
        span.innerHTML = line;
        span.classList.add("line-wrapper");
        p.appendChild(span);

        if (index < lines.length - 1) {
          p.appendChild(document.createElement("br"));
        }
      });
    });
  }, []); // 한 번만 실행되도록 빈 의존성 배열 사용
  // 기존 useEffect 내용 중 wheel 이벤트 관리 부분
  useEffect(() => {
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
  }, [action, loaded, interactive, isScrolling, pageHeight, scrollLocation]); // 필요한 의존성 배열 사용

  const getInfo = (isInteractive, isLoaded) => {
    setInteractive(isInteractive);
    setLoaded(isLoaded);
  };

  const pageTexts = [
    {
      subtitle: "더위는 모두에게 평등한가",
      title1: "동자동 폭염 불평등 지도로 보는",
      title2: "여름의 비극",
      description:
        "*본 프로젝트는 한국일보, <도시 빈자들의 최후의 주거지 - 지옥고 아래 쪽방>을 데이터 시각화로서 재구성한 프로젝트입니다.",
    },
    {
      content: <p>매년 다가오는 여름은 쪽방촌 주민들에게 치명적인 위협이다.</p>,
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center">
          <p>
            KBS의 보도 자료에 따르면, <br /> 한여름 쪽방촌의 표면 온도는
            아파트에 비해{" "}
            <span style={{ color: "#FE5657" /* red */ }}>30도</span> 가량
            높았다.
          </p>
          <div class="flex justify-center my-[3vmin] w-[75%]">
            <img src="/표면온도.png" class="w-full" />
          </div>
          <p className="font-Pretendard-Regular text-[3vmin]">
            이예린, [폭염격차]① 쪽방촌 표면 온도 ‘30도 더 뜨거웠다’,
            《KBS뉴스》, 2022.07.23.
          </p>
        </div>
      ),
    },
    {
      content: (
        <p>이러한 현상은 쪽방촌의 열악한 주거 환경에서 비롯된 것으로,</p>
      ),
    },
    {
      content: (
        <div>
          <p>
            쪽방촌 주민이 기후 위기에 준 영향은 적으나 피해를 입는 정도는 크다는
            점에서 <br />
          </p>
          <p className="text-[6vmin]">
            <span style={{ color: "#FE5657" /* red */ }}>폭염 불평등</span>에
            해당한다.
          </p>
        </div>
      ),
    },
    {
      content: (
        <div className="my-[10vmin]">
          <p>
            이에 본 프로젝트는 서울시 4대 쪽방촌 중<br />
            국내 최대 규모 쪽방촌인{" "}
            <span style={{ color: "#FE5657" /* red */ }}>동자동</span>의 폭염
            불평등 실태를 조사하였다.
          </p>
        </div>
      ),
    },
    {
      content: (
        <p>
          폭염 불평등 실태를 나타내는 점수는 <br />
          면적당 전력 사용량, 건물 연한과 단열 등급을 반영한 계산식으로
          도출하였다.
        </p>
      ),
    },
    {
      content: (
        <p className="my-[10vmin]">
          쪽방촌 일대의 폭염 불평등 점수는 평균{" "}
          <span style={{ color: "#FE5657" /* red */ }}>59.7점</span>으로
          나타났다.
        </p>
      ),
    },
    {
      content: (
        <p className="my-[10vmin]">
          쪽방촌을 제외한 동자동 일대의 폭염 불평등 점수는 평균{" "}
          <span style={{ color: "#8BC1E8" /* blue */ }}>55.7점</span>으로
          나타났다.
        </p>
      ),
    },
    {
      content: (
        <p>
          그렇다면 동자동 쪽방촌 건물 소유주들의
          <br />
          주거 환경은 어떠할까?
        </p>
      ),
    },
  ];

  const getBackgroundStyle = (action) => {
    console.log("action:", action);
    return action >= 0 && action <= 4
      ? { backgroundImage: "url('/background.png')" }
      : {};
  };

  return (
    <main
      className="font-Pretendard-Regular scroll-smooth"
      style={{ height: `${(maxPage + 1) * 100}vh` }}
    >
      <MapB action={action} getInfo={getInfo} />

      {/* 배경 이미지가 고정된 상태로 표시됨 */}
      <div className="relative z-10">
        {/* 커버 */}
        <div
          id="page-0"
          className="cover w-screen h-screen faded-bottom overflow-hidden"
        >
          <div className="w-screen h-screen">
            <div className="absolute text-white top-0 left-0 flex flex-col text-left md:ml-[10%] ml-[5%]">
              <p className="mt-[20vh] text-[6vmin]">{pageTexts[0].subtitle}</p>
              <p className="mt-[5vh] text-[8vmin] leading-tight font-Pretendard-ExBold">
                {pageTexts[0].title1}
              </p>
              <p className="text-[8vmin] leading-tight font-Pretendard-ExBold">
                {pageTexts[0].title2}
              </p>
            </div>
            <p className="absolute text-white bottom-[20vh] text-left text-[2.7vmin] md:ml-[10%] mr-[10%] ml-[5%]">
              {pageTexts[0].description}
            </p>
          </div>
        </div>
        {/* <div className="attach-image w-screen h-screen"></div> */}
        {/* 배경 이미지가 고정된 상태로 표시됨 */}
        <div
          className="attach-image w-screen h-screen"
          style={getBackgroundStyle(action)}
        ></div>
        {pageTexts.slice(1).map((pageText, index) => (
          <div
            key={index + 1}
            id={`page-${index + 1}`}
            className={`h-screen flex flex-col items-center text-white ${
              index + 1 === 5
                ? "justify-start"
                : index + 1 === 7 || index + 1 === 8
                ? "justify-end"
                : "justify-center"
            } page-${index + 1}`}
          >
            <div className="text-center font-Pretendard-ExBold text-[4vmin]">
              {pageText.content}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
