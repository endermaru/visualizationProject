import { useEffect, useState, useRef } from "react";
import MapB from "./components/map";
import handler from "./api/hello";

export default function Home() {
  const [pageHeight, setPageHeight] = useState(0);
  const pageHeightRef = useRef(pageHeight); // useRef로 최신 상태값을 추적
  const maxPage = 14;

  //Map 컴포넌트 통신용
  const [action, setAction] = useState(0);
  const actionRef = useRef(action);
  const [interactive, setInteractiveIndex] = useState(false);
  const interRef = useRef(interactive);

  //점수환산표
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setPageHeight(height);
      pageHeightRef.current = height; // 최신 높이값을 ref에 저장
      window.scrollTo({ top: actionRef.current * pageHeightRef.current });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // line-wrapper 관련 부분
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
  }, []);

  // 스크롤 + 키보드
  const handleWheel = (event) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
      if (!interRef.current) {
        window.removeEventListener("wheel", handleWheel);
        const direction = event.deltaY;
        setAction((prevAction) => {
          //점수환산표 끄기
          if (prevAction==6) setShowTable(false);
          const newAction =
            direction > 0
              ? Math.min(prevAction + 1, maxPage)
              : Math.max(prevAction - 1, 0);
          actionRef.current = newAction;
          window.scrollTo({
            top: newAction * pageHeightRef.current,
            behavior: "smooth",
          });
          return newAction;
        });
        setTimeout(() => {
          window.addEventListener("wheel", handleWheel, { passive: false });
        }, 1000);
      }
    }
  };
  const handleKeyDown = (event) => {
    let flag =
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
        ? true
        : false;
    if (flag && typeof window !== "undefined") {
      event.preventDefault();
      if (!interRef.current) {
        window.removeEventListener("keydown", handleKeyDown);
        const direction =
          event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
        setAction((prevAction) => {
          //점수환산표 끄기
          if (prevAction==6) setShowTable(false);
          const newAction =
            direction > 0
              ? Math.min(prevAction + 1, maxPage)
              : Math.max(prevAction - 1, 0);
          actionRef.current = newAction;
          window.scrollTo({
            top: newAction * pageHeightRef.current,
            behavior: "smooth",
          });
          return newAction;
        });
        setTimeout(() => {
          window.addEventListener("keydown", handleKeyDown);
        }, 1000);
      }
    }
  };

  // disable
  const disableWheel = (event) => {
    event.preventDefault();
  };
  const disableKeyDown = (event) => {
    let flag =
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
        ? true
        : false;
    if (flag) event.preventDefault();
  };

  useEffect(() => {
    //리셋
    actionRef.current = 0;
    setAction(13);
    window.scrollTo({ top: 0 });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("wheel", disableWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", disableKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("wheel", disableWheel, { passive: false });
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", disableKeyDown);
    };
  }, []);

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
          <div className="flex justify-center my-[3vmin] w-[75%]">
            <img src="/표면온도.png" className="w-full" />
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
        <>
        {showTable && (
          <img
            className="fixed inset-0 z-20 fade-in border border-0 rounded-md w-[50%] m-auto"
            onClick={() => setShowTable(false)}
            src="점수환산표.jpg"
            alt="점수환산표"
            style={{ top: '0', bottom: '0', left: '0', right: '0', transform: 'translateY(-18%)'}}
          />
        )}

        <div className="my-[10vmin] relative flex flex-col justify-end items-center ">
          <button className="flex justify-center z-10 fade-in fade-out rounded-full p-2 m-1 aspect-square 
            border border-1 border-stone-700 bg-white flex flex-col place-items-center text-stone-700 hover:text-blue-600" 
              onClick={()=>{
                setShowTable(!showTable);
              }}
          >
            <p className='font-2xl font-bold'>?</p>
            <p className='font-Pretendard-ExBold text-xs'>점수계산</p>
          </button>
          <p>
          폭염 불평등 실태를 나타내는 점수는 <br />
          면적당 전력 사용량, 건물 연한과 단열 등급을 반영한 계산식으로
          도출하였다.
          </p>

          
        </div>
        </>
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
    // case 1
    {
      content: (
        <div className="flex flex-row justify-between items-start w-screen h-screen px-[9vmin]">
          <div className="flex flex-col justify-between w-[30vmax] h-full p-[5vmin] text-[3vmin] bg-neutral-600/50">
            <div className="h-[8vmin] flex flex-col justify-center">
              <div className="text-[2.8vmin] font-Pretendard-Regular">
                서울특별시 용산구 동자동 7-10
              </div>
            </div>

            <div className="flex justify-center h-1/4">
              <img src="/case1-1.png" alt="case 1 img 1" className="w-3/4" />
            </div>
            <p>
              폭염 불평등 점수: <span style={{ fontSize: "160%" }}>73.25</span>
            </p>
            <div className="flex justify-center">
              <img src="/score1-1.png" alt="case 1 img 2" className="w-4/5" />
            </div>
            <div className="flex justify-center items">
              <table className="font-Pretendard-Regular text-left w-full">
                <tbody>
                  <tr>
                    <td className="pt-[2vmin]">사용승인일</td>
                    <td className="pt-[2vmin]">1969.11.26.</td>
                  </tr>
                  <tr>
                    <td>단열등급</td>
                    <td>0등급</td>
                  </tr>
                  <tr>
                    <td className="pb-[2vmin]">면적당<br/>전력사용량</td>
                    <td className="pb-[2vmin]">
                      3.52 kWh/m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <th>공시지가</th>
                    <th>1억 1900만 원</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center text-[4vmin] my-[6vmin]">
            CASE 1. 강남 건물주
          </div>
          <div className="flex flex-col justify-between w-[30vmax] h-screen p-[5vmin] text-[3vmin] bg-neutral-600/50">
            <div className="h-[8vmin] flex flex-col justify-center">
              <div className="text-[2.8vmin] font-Pretendard-Regular">
                서울특별시 강남구 대치동 65
                <br />
                대치 쌍용2차 9동 1302호
              </div>
            </div>
            <div className="flex justify-center h-1/4">
              <img src="/case1-2.png" alt="case 1 img 2" className="w-3/4" />
            </div>
            <p>
              폭염 불평등 점수: <span style={{ fontSize: "160%" }}> 58.34</span>
            </p>
            <div className="flex justify-center">
              <img src="/score1-2.png" alt="case 1 img 2" className="w-4/5" />
            </div>
            <div className="flex justify-center items">
              <table className="font-Pretendard-Regular text-left w-full">
                <tbody>
                  <tr>
                    <td className="pt-[2vmin]">사용승인일</td>
                    <td className="pt-[2vmin]">1983.11.30.</td>
                  </tr>
                  <tr>
                    <td>단열등급</td>
                    <td>1등급</td>
                  </tr>
                  <tr>
                    <td className="pb-[2vmin]">면적당<br/>전력사용량</td>
                    <td className="pb-[2vmin]">
                      4.59 kWh/m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <th>공시지가</th>
                    <th>15억 7300만 원</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    // case 2
    {
      content: (
        <div className="flex flex-row justify-between items-start w-screen h-screen px-[9vmin]">
          <div className="flex flex-col justify-between w-[30vmax] h-full p-[5vmin] text-[3vmin] bg-neutral-600/50">
            <div className="h-[8vmin] flex flex-col justify-center">
              <div className="text-[2.8vmin] font-Pretendard-Regular">
                서울특별시 용산구 동자동 7-12
              </div>
            </div>

            <div className="flex justify-center h-1/4">
              <img src="/case1-1.png" alt="case 1 img 1" className="w-3/4" />
            </div>
            <p>
              폭염 불평등 점수: <span style={{ fontSize: "160%" }}>73.25</span>
            </p>
            <div className="flex justify-center">
              <img src="/score1-1.png" alt="case 1 img 2" className="w-4/5" />
            </div>
            <div className="flex justify-center items">
              <table className="font-Pretendard-Regular text-left w-full">
                <tbody>
                  <tr>
                    <td className="pt-[2vmin]">사용승인일</td>
                    <td className="pt-[2vmin]">1969.11.26.</td>
                  </tr>
                  <tr>
                    <td>단열등급</td>
                    <td>0등급</td>
                  </tr>
                  <tr>
                    <td className="pb-[2vmin]">면적당<br/>전력사용량</td>
                    <td className="pb-[2vmin]">
                      3.52 kWh/m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <th>공시지가</th>
                    <th>1억 7100만 원</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center text-[4vmin] my-[6vmin]">
            CASE 2. 지방 큰손
          </div>
          <div className="flex flex-col justify-between w-[30vmax] h-screen p-[5vmin] text-[3vmin] bg-neutral-600/50">
            <div className="h-[8vmin] flex flex-col justify-center">
              <div className="text-[2.8vmin] font-Pretendard-Regular">
                경상남도 창원시 성산구 상남동 44-1
                <br />
                대동아파트 122동 702호
              </div>
            </div>
            <div className="flex justify-center h-1/4">
              <img src="/case1-2.png" alt="case 1 img 2" className="w-3/4" />
            </div>
            <p>
              폭염 불평등 점수: <span style={{ fontSize: "160%" }}> 51.44</span>
            </p>
            <div className="flex justify-center">
              <img src="/score1-2.png" alt="case 1 img 2" className="w-4/5" />
            </div>
            <div className="flex justify-center items">
              <table className="font-Pretendard-Regular text-left w-full">
                <tbody>
                  <tr>
                    <td className="pt-[2vmin]">사용승인일</td>
                    <td className="pt-[2vmin]">1994.12.24.</td>
                  </tr>
                  <tr>
                    <td>단열등급</td>
                    <td>1등급</td>
                  </tr>
                  <tr>
                    <td className="pb-[2vmin]">면적당<br/>전력사용량</td>
                    <td className="pb-[2vmin]">
                      5.56 kWh/m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <th>공시지가</th>
                    <th>3억 4100만 원</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    // case 3
    {
      content: (
        <div className="flex flex-row justify-between items-start w-screen h-screen px-[9vmin]">
          <div className="flex flex-col justify-between w-[30vmax] h-full p-[5vmin] text-[3vmin] bg-neutral-600/50">
            <div className="h-[8vmin] flex flex-col justify-center">
              <div className="text-[2.8vmin] font-Pretendard-Regular">
                서울특별시 용산구 동자동 10-6
              </div>
            </div>

            <div className="flex justify-center h-1/4">
              <img src="/case1-1.png" alt="case 1 img 1" className="w-3/4" />
            </div>
            <p>
              폭염 불평등 점수: <span style={{ fontSize: "160%" }}>75.99</span>
            </p>
            <div className="flex justify-center">
              <img src="/score1-1.png" alt="case 1 img 2" className="w-4/5" />
            </div>
            <div className="flex justify-center items">
              <table className="font-Pretendard-Regular text-left w-full">
                <tbody>
                  <tr>
                    <td className="pt-[2vmin]">사용승인일</td>
                    <td className="pt-[2vmin]">1956.05.26.</td>
                  </tr>
                  <tr>
                    <td>단열등급</td>
                    <td>0등급</td>
                  </tr>
                  <tr>
                    <td className="pb-[2vmin]">면적당<br/>전력사용량</td>
                    <td className="pb-[2vmin]">
                      4.00 kWh/m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <th>공시지가</th>
                    <th>-</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center text-[4vmin] my-[6vmin]">
            CASE 3. 고급 주거 단지 주민
          </div>
          <div className="flex flex-col justify-between w-[30vmax] h-screen p-[5vmin] text-[3vmin] bg-neutral-600/50">
            <div className="h-[8vmin] flex flex-col justify-center">
              <div className="text-[2.8vmin] font-Pretendard-Regular">
                서울특별시 송파구 잠실동 19
                <br />
                잠실엘스 166동 904호
              </div>
            </div>
            <div className="flex justify-center h-1/4">
              <img src="/case1-2.png" alt="case 1 img 2" className="w-3/4" />
            </div>
            <p>
              폭염 불평등 점수: <span style={{ fontSize: "160%" }}> 47.13</span>
            </p>
            <div className="flex justify-center">
              <img src="/score1-2.png" alt="case 1 img 2" className="w-4/5" />
            </div>
            <div className="flex justify-center items">
              <table className="font-Pretendard-Regular text-left w-full">
                <tbody>
                  <tr>
                    <td className="pt-[2vmin]">사용승인일</td>
                    <td className="pt-[2vmin]">2008.09.30.</td>
                  </tr>
                  <tr>
                    <td>단열등급</td>
                    <td>2등급</td>
                  </tr>
                  <tr>
                    <td className="pb-[2vmin]">면적당<br/>전력사용량</td>
                    <td className="pb-[2vmin]">
                      3.45 kWh/m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <th>공시지가</th>
                    <th>15억 8700만 원</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    // credit
    {
      content: (
        <div class="flex flex-col justify-between w-screen h-screen px-[10%] py-[5%]">
          <p class="text-left text-[6vmin]">관련 기사 전체 보기</p>
          <div class="flex justify-center px-[8vmin]">
            <a
              href="https://interactive.hankookilbo.com/v/jjogbang/"
              class="flex flex-col w-1/5 items-center pb-[1vmin] bg-white shadow-lg mx-[5%]"
            >
              <img src="/credit1.png" alt="이미지 1" class="mb-[1vmin]" />
              <p class="font-Pretendard-Regular text-[2vmin] text-black text-center">
                [한국일보] <br />
                도시 빈자들의 최후의 주거지 <br />- 지옥고 아래 쪽방
              </p>
            </a>
            <a
              href="https://news.kbs.co.kr/news/pc/view/view.do?ncd=5516283"
              class="flex flex-col w-1/5 items-center pb-[1vmin] bg-white shadow-lg mx-[5%]"
            >
              <img src="/credit2.png" alt="이미지 2" class="mb-[1vmin]" />
              <p class="font-Pretendard-Regular text-[2vmin] text-black text-center">
                [KBS] <br />
                [폭염격차]① 쪽방촌 표면 온도 <br />
                ‘30도 더 뜨거웠다’
              </p>
            </a>
          </div>

          <div class="text-center">
            <p class="font-Pretendard-Regular text-[3vmin]">
              서울대학교 연합전공 정보문화학 <br /> 24-1 비주얼라이제이션 B조{" "}
              <br />
              김민서 김재연 이서현 임광섭 정현아
            </p>
          </div>
          <div class="text-center">
            <p class="text-[4.5vmin]">
              아래로 스크롤하면 시각화 작업물을 자유롭게 둘러볼 수 있습니다.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const getBackgroundStyle = (action) => {
    return action >= 0 && action <= 4
      ? { backgroundImage: "url('/background.png')" }
      : {};
  };

  return (
    <main
      className="font-Pretendard-Regular scroll-smooth"
      style={{ height: `${(maxPage + 1) * 100}vh` }}
      id="mainPage"
    >
      <MapB
        action={action}
        getInfo={(e) => {
          setInteractiveIndex(e);
          interRef.current = e;
        }}
      />
      {action==14 && <button className="fixed flex items-center justify-center bottom-5 left-0 fade-in fade-out rounded-full w-[7vmin] h-[7vmin] aspect-square m-3 aspect-square 
            border border-1 border-stone-700 bg-white text-stone-700 hover:text-blue-600" 
          onClick={()=>{setAction(0);window.scrollTo({top:0});}}
          >
            <p className='text-[1.3vmin] font-Pretendard-ExBold'>웹페이지<br/>처음부터<br/>다시보기</p>

      </button>}

      {/* 배경 이미지가 고정된 상태로 표시됨 */}
      {action < 14 && (
        <div className="relative z-10">
          {/* 커버 */}
          <div
            id="page-0"
            className="cover w-screen h-screen faded-bottom overflow-hidden"
          >
            <div className="w-screen h-screen">
              <div className="absolute text-white top-0 left-0 flex flex-col text-left md:ml-[10%] ml-[5%]">
                <p className="mt-[20vh] text-[6vmin]">
                  {pageTexts[0].subtitle}
                </p>
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
            className="attach-image w-screen h-screen fade-out"
            style={getBackgroundStyle(action)}
          ></div>
          {pageTexts.slice(1).map((pageText, index) => (
            <div
              key={index + 1}
              id={`page-${index + 1}`}
              className={`h-screen flex flex-col items-center text-white ${
                index + 1 === 5
                  ? "justify-start"
                  : index + 1 ===6 || index + 1 === 7 || index + 1 === 8
                  ? "justify-end"
                  : "justify-center"
              }
              ${index + 1 == 9 || index + 1 == 13 ? "bg-neutral-600/50" : ""}
              page-${index + 1}`}
            >
              <div className="text-center font-Pretendard-ExBold text-[4vmin]">
                {pageText.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
