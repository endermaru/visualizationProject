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
    setAction(0);
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
        <p>
          KBS의 보도 자료에 따르면, <br /> 한여름 쪽방촌의 표면 온도는 아파트에
          비해 <span style={{ color: "red" }}>30도</span> 가량 높았다.
        </p>
      ),
    },
    {
      content: (
        <p>
          한국환경연구원의 조사 결과, <br />
          한여름 쪽방촌의 실내 최고 온도는{" "}
          <span style={{ color: "red" }}>34.9도</span>로 <br />
          단독주택이나 아파트보다 평균 <span style={{ color: "red" }}>
            3도
          </span>{" "}
          안팎으로 높았다.
        </p>
      ),
    },
    {
      content: (
        <p>
          이러한 현상은 쪽방촌의 열악한 주거 환경에서 비롯된 것으로,
          <br />
          쪽방촌 주민이 기후 위기에 준 영향은 적으나 <br />
          피해를 입는 정도는 크다는 점에서 폭염 불평등에 해당한다.
        </p>
      ),
    },
    {
      content: (
        <p>
          이에 본 프로젝트는 서울시 4대 쪽방촌 중<br />
          국내 최대 규모 쪽방촌인 <span style={{ color: "red" }}>동자동</span>의
          폭염 불평등 실태를 조사하였다.
        </p>
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
        <p>
          쪽방촌 일대의 폭염 불평등 점수는 평균{" "}
          <span style={{ color: "red" }}>00점</span>으로 나타났다.
        </p>
      ),
    },
    {
      content: (
        <p>
          쪽방촌을 제외한 동자동 일대의 폭염 불평등 점수는 평균{" "}
          <span style={{ color: "blue" }}>00점</span>으로 나타났다.
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
      {action<14 && <div className="relative z-10">
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
            className={`h-screen flex flex-col items-center justify-center text-white page-${
              index + 1
            }`}
          >
            <div className="text-center font-Pretendard-ExBold text-[5vmin]">
              {pageText.content}
            </div>
          </div>
        ))}
      </div>}
    </main>
  );
}
