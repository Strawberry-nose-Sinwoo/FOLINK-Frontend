// src/App.tsx
import React, { useState, useEffect } from 'react';
import styles from './style.module.css'; // CSS Modules 임포트

// 외부 CDN 방식의 Phosphor Icons를 사용하기 위한 최소한의 JSX 엘리먼트입니다.
// 실제 React 앱에서는 @phosphor-icons/react 라이브러리를 설치하여 사용하는 것이 일반적입니다.
const PhosphorArrowUpRight = () => <i className="ph-bold ph-arrow-up-right"></i>;

// 질문 데이터 타입 정의
interface InterviewQuestion {
    category: string[];
    question: string;
    answer: string;
    reference: string;
}

interface propsType {
    catagoryProps: '프론트엔드' | '백엔드' | 'all'
}

// 면접 질문 데이터
const interviewQuestions: InterviewQuestion[] = [
    { category: ["프론트엔드", "백엔드"], question: "RESTful API에 대해 설명해주세요.", answer: "RESTful API는 HTTP 프로토콜을 기반으로하는 웹 서비스 아키텍처입니다. 자원, 메소드, 메시지 등을 정의하여 클라이언트-서버 간의 통신을 가능하게 합니다. 또한, RESTful API는 표준 HTTP 메소드(GET, POST, PUT, DELETE)를 사용하여 서버와 통신합니다.", reference: "https://velog.io/@somday/RESTful-API-%EC%9D%B4%EB%9E%80" },
    { category: ["프론트엔드", "백엔드"], question: "CSRF나 XSS 공격을 막는 방법은?", answer: "CSRF 공격을 막기 위해서는 서버에서 CSRF Token을 생성하여 세션에 저장하고, 프론트엔드에서 요청 시 해당 Token을 함께 전송하여 인증합니다. SameSite 속성을 쿠키에 설정하여 도메인이 다른 사이트에서는 쿠키를 사용할 수 없도록 제한하는 방법도 있습니다. XSS 공격을 막기 위해서는 입력 값들을 유효성 검증하고, 특수문자들을 제외하는 정규식을 통해서 제거합니다. 또, 서버에서 CSP(Content-Security-Policy)정책을 설정하여, 허용된 스크립트만 실행되도록 제한 할 수도 있습니다. 마지막으로, HTTP 대신에 신뢰할 수 있는 HTTPS를 사용하여 통신 프로토콜을 암호화할 수 있습니다.", reference: "https://velog.io/@cjyooong/CSRF-%EA%B3%B5%EA%B2%A9%EC%9D%B4%EB%9E%80-%EA%B7%B8%EB%A6%AC%EA%B3%B5-CSRF-%EB%B0%A9%EC%96%B4-%EB%B0%A9%EB%B2%95" },
    { category: ["프론트엔드"], question: "브라우저 렌더링 원리에 대해서 설명해보세요.", answer: "브라우저 렌더링은 HTML, CSS, JavaScript 등의 웹 페이지 자원을 브라우저가 화면에 그리는 과정을 말합니다. 브라우저 렌더링 원리와 순서는 크게 다음과 같은 단계로 구성됩니다.\n먼저 DOM을 생성합니다. 브라우저는 HTML 문서를 파싱하여 DOM 트리를 생성합니다. 이때, HTML 태그를 노드로 변환하고, 노드간의 계층 관계를 형성합니다.\n두 번째로 CSSOM을 생성합니다. 브라우저는 CSS 파일을 파싱하여 CSSOM 트리를 생성합니다. 이때, CSS 속성을 노드로 변환하고, 노드간의 계층 관계를 형성합니다.\n세 번째로 DOM트리와 CSSOM을 결합하여 렌더 트리를 생성 합니다. 이때, 실제 화면에 표시될 요소만을 선택하여 렌더 트리를 형성합니다.\n이제, 브라우저는 렌더 트리를 이용하여 각 요소의 크기와 위치를 계산하는 과정인 레이아웃을 거쳐 화면에 요소를 그리는 페인팅 과정을 거치게 됩니다. 이때, 요소의 배경, 테두리, 글자 등을 그리게 됩니다.", reference: "https://opendeveloper.tistory.com/entry/FrontEnd-%EC%A7%80%EC%8B%9D%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%9B%90%EB%A6%AC%EC%99%80-%EC%88%9C%EC%84%B8%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%84%ED%99%94-%EA%B3%A0%EB%A0%A4%EC%82%AC%ED%95%AD" },
    { category: ["프론트엔드"], question: "클래스형 컴포넌트와 함수형 컴포넌트의 차이는 무엇일까요?", answer: "리액트에서 컴포넌트를 만드는 방법에는 클래스형 컴포넌트(class components)와 함수형 컴포넌트(functional components)가 있습니다. 클래스형 컴포넌트는 ES6의 클래스(class)를 사용하여 컴포넌트를 정의합니다. 이 방식은 React의 컴포넌트의 상태(state)와 생명주기(lifecycle)를 다룰 때 매우 유용합니다.\n반면에 함수형 컴포넌트는 ES6의 화살표 함수(arrow function)를 사용하여 컴포넌트를 정의합니다. 이 방식은 훅(hook) API와 함께 많이 사용되며, 컴포넌트의 상태와 생명주기를 다룰 때도 유용합니다.\n클래스형 컴포넌트와 함수형 컴포넌트의 가장 큰 차이점은 상태와 생명주기의 다루는 방식입니다. 클래스형 컴포넌트는 상태를 this.state로 정의하고, 생명주기 메서드를 오버라이드하여 다양한 작업을 수행합니다. 반면에 함수형 컴포넌트는 상태를 useState 훅을 사용하여 정의하고, useEffect 훅을 사용하여 생명주기를 다룹니다. 또한, 클래스형 컴포넌트에서는 this 키워드를 사용하여 상태나 메서드를 참조하며, 함수형 컴포넌트에서는 this 키워드를 사용하지 않습니다. 이러한 차이점 때문에, 함수형 컴포넌트는 더 간결하고 가독성이 좋아지며, 테스트와 리팩토링이 쉽게 이루어질 수 있습니다.", reference: "https://velog.io/@sdc337dc/0.%ED%81%B4%EB%9E%98%EC%8A%A4%ED%98%95-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8" },
    { category: ["백엔드"], question: "캐싱(Caching)이란 무엇이며, 어떤 상황에서 사용하나요?", answer: "캐싱은 자주 사용되는 데이터를 빠르게 접근할 수 있도록 메모리나 디스크에 저장하는 기술입니다. 예를 들어, Redis나 Memcached 같은 인메모리 캐시를 사용해 데이터베이스 부하를 줄입니다.", reference: "https://velog.io/@effypark/%EC%BA%90%EC%8B%9C-%EC%BA%90%EC%BB%B5%EC%9D%B4%EB%9E%80" },
    { category: ["백엔드"], question: "동시성(Concurrency) 문제를 해결하기 위해 어떤 방법을 사용하나요?", answer: "동시성 문제는 여러 스레드나 프로세스가 동시에 같은 자원에 접근할 때 발생하는데요, 이를 해결하는 방법은 몇 가지가 있습니다. 먼저, 락을 사용해 동시 접근을 제어할 수 있습니다. 뮤텍스나 세마포어 같은 방식이죠. 또, 낙관적 락은 데이터 충돌 가능성이 낮을 때 버전 체크로 문제를 해결하고, 비관적 락은 아예 먼저 락을 걸어서 다른 접근을 차단합니다. 비동기 처리로는 RabbitMQ나 Kafka 같은 메시지 큐를 사용해 요청을 순차적으로 처리할 수도 있습니다. 마지막으로, 데이터베이스 트랜잭션을 활용하면 ACID 속성을 통해 데이터 일관성을 보장할 수 있습니다. 상황에 따라 성능과 안정성을 고려해 적절한 방법을 선택하는 게 중요하다고 생각합니다.", reference: "https://velog.io/@yellowsunn/%EB%8F%99%EC%8B%9C%EC%84%B1-%EC%9D%B4%EC%8A%88%EB%A5%BC-%ED%95%B4%EA%B2%B0%ED%95%98%EB%8A%94-%EB%8B%A4%EC%96%91%ED%95%9C-%EB%B0%A9%EB%B2%95" },
    { category: ["백엔드"], question: "HTTP 상태 코드 중 200, 404, 500의 의미는 무엇인가요?", answer: "HTTP 상태 코드는 클라이언트 요청에 대한 서버 응답 상태를 나타내는데요, 200은 요청이 성공적으로 처리되었음을 의미합니다. 예를 들어, GET 요청으로 데이터를 잘 받아왔을 때 반환됩니다. 404는 요청한 리소스를 서버에서 찾을 수 없을 때 나옵니다, 흔히 '페이지 없음' 오류죠. 500은 서버 내부에서 오류가 발생했을 때 반환되는 코드로, 예를 들어 데이터베이스 연결 실패나 코드 에러 같은 경우입니다. 이런 코드들을 잘 이해하고 있어야 클라이언트와 서버 간 통신 문제를 빠르게 파악할 수 있다고 봅니다.", reference: "https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Status" },
    { category: ["백엔드"], question: "로드 밸런싱(Load Balancing)이란 무엇이고, 어떤 방식으로 동작하나요?", answer: "로드 밸런싱은 트래픽을 여러 서버에 분산시켜 시스템의 성능과 안정성을 높이는 기술입니다. 예를 들어, 웹 서버가 여러 대일 때, 사용자의 요청을 적절히 나눠주는 역할을 하죠. 동작 방식으로는 라운드 로빈(Round Robin), 최소 연결(Least Connections), IP 해시 같은 알고리즘이 있습니다. 라운드 로빈은 요청을 순차적으로 서버에 분배하고, 최소 연결은 현재 연결이 적은 서버로 보내는 식입니다. Nginx나 AWS ELB 같은 도구를 사용해 구현할 수 있고, 이를 통해 서버 과부하나 다운타임을 줄이는 데 효과적이라고 생각합니다.", reference: "https://habitus92.tistory.com/22" },
    { category: ["프론트엔드"], question: "Virtual DOM이 무엇이고, 왜 사용하는 건가요?", answer: "Virtual DOM은 실제 DOM의 가상 복사본으로, 메모리에 유지되는 경량화된 객체 트리입니다. React 같은 라이브러리에서 주로 사용되는데요, UI 변경이 필요할 때 실제 DOM을 바로 건드리지 않고 Virtual DOM에서 먼저 변경 사항을 계산합니다. 그다음 이전 상태와 비교(diffing)해서 바뀐 부분만 실제 DOM에 반영하죠. 이렇게 하면 DOM 조작이 최소화돼서 성능이 향상됩니다. 특히, 복잡한 UI나 빈번한 업데이트가 있는 앱에서 유용하다고 생각합니다. 예를 들어, 리스트 데이터가 자주 바뀌는 경우 Virtual DOM 덕분에 효율적으로 렌더링할 수 있습니다.", reference: "https://wikidocs.net/273873" },
    { category: ["프론트엔드"], question: "프론트엔드 성능 최적화 방법에는 어떤 것들이 있나요?", answer: "프론트엔드 성능 최적화를 위해선 몇 가지 방법이 있습니다. 먼저, 이미지나 리소스를 압축하고 WebP 같은 효율적인 포맷을 사용하는 게 좋습니다. 두 번째로, CSS와 자바스크립트를 최소화(minify)하고 번들링해서 요청 수를 줄입니다. 세 번째, Lazy Loading을 적용해 화면에 보이지 않는 이미지나 컴포넌트를 지연 로드하면 초기 로딩 속도가 빨라집니다. 또, Critical Rendering Path를 최적화하기 위해 CSS를 head에, 자바스크립트를 body 끝에 배치하는 것도 효과적입니다. 마지막으로, React 같은 경우엔 useMemo나 useCallback을 활용해 불필요한 리렌더링을 방지합니다. 이런 방법들로 사용자 경험을 개선할 수 있다고 생각합니다.", reference: "https://hayeonn.tistory.com/108" },
    { category: ["백엔드"], question: "ORM이 편하고 좋은데, SQL을 알아하는 이유가 무엇인가요?", answer: "ORM(Object-Relational Mapping)은 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑시켜주는 프레임워크. ORM을 사용하면 SQL 쿼리가 아닌 직관적인 코드(메소드)로 데이터를 조작할 수 있어서 가독성이 좋습니다.\nORM이 편리하고 좋지만, SQL을 알아야 하는 이유는 ORM이 RDBMS에 대한 종속성을 줄여주지만, 개발자가 높은 RDBMS 지식을 요구합니다. ORM을 사용하는 경우에도 SQL 쿼리의 성능 최적화와 같은 작업이 필요", reference: "https://www.elancer.co.kr/blog/detail/156" },
    { category: ["백엔드"], question: "세션과 쿠키의 차이점을 설명해보세요.", answer: "세션과 쿠키의 가장 큰 차이점은 상태 정보의 저장위치. 쿠키는 클라이언트에 저장하고, 세션은 서버에 저장합니다.\n보안면에서는 세션이 우수하고, 요청 속도는 쿠키가 세션보다 빠릅니다.", reference: "https://judahhh.tistory.com/46" },
    { category: ["프론트엔드", "백엔드"], question: "마지막으로 하고 싶은 말이 있나요?", answer: "지금까지 면접에 참여할 기회를 주셔서 감사합니다. 저는 귀사의 비전과 가치에 깊이 공감하며, 제가 가진 기술과 열정으로 팀에 기여하고 싶습니다. 저의 성장 가능성을 믿고 함께할 기회를 주신다면, 끊임없이 배우고 발전하는 모습으로 보답하겠습니다.", reference: "#" }
];

function App({catagoryProps}: propsType) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>(interviewQuestions);
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    // 카테고리가 변경될 때마다 질문을 필터링하고 인덱스를 초기화합니다.
    useEffect(() => {
        setActiveCategory(catagoryProps)
        if (activeCategory === 'all') {
            setFilteredQuestions(interviewQuestions);
        } else {
            setFilteredQuestions(interviewQuestions.filter(q => q.category.includes(activeCategory)));
        }
        setCurrentQuestionIndex(0); // 필터가 바뀌면 첫 질문으로 돌아갑니다.
        setShowAnswer(false); // 답변은 숨깁니다.
    }, [activeCategory]);

    // 현재 질문 객체
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    // 질문이 있는지 확인 (0개일 경우 처리)
    const hasQuestions = filteredQuestions.length > 0;

    // 답변 보기/숨기기 토글
    const handleToggleAnswer = () => {
        setShowAnswer(prev => !prev);
    };

    // 다음 질문으로 이동
    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % filteredQuestions.length);
        setShowAnswer(false); // 다음 질문으로 넘어가면 답변은 숨깁니다.
    };

    // 카테고리 필터 변경
    const handleCategoryChange = (category: string) => {
        setActiveCategory(catagoryProps);
    };

    return (
        <div className={styles.body}> {/* styles.body로 클래스 적용 */}
            <div className={styles.container}>
                <div className={styles.card}>
                    <main>
                        <div className={styles.questionDisplay}>
                            <div className={styles.questionMeta}>
                                <span className={styles.questionCategory}>
                                    {hasQuestions ? currentQuestion.category.join(', ') : '없음'}
                                </span>
                                <span className={styles.progressIndicator}>
                                    {hasQuestions ? `${currentQuestionIndex + 1} / ${filteredQuestions.length}` : '0 / 0'}
                                </span>
                            </div>
                            <p className={styles.questionText}>
                                {hasQuestions ? currentQuestion.question : '선택한 분야에 해당하는 질문이 없습니다.'}
                            </p>
                        </div>

                        <div className={`${styles.answerContainer} ${showAnswer ? styles.visible : ''}`}>
                            <div className={styles.answerContent}>
                                <h3 className={styles.answerTitle}>모범 답안 예시</h3>
                                <p className={styles.answerText}>
                                    {hasQuestions ? currentQuestion.answer : ''}
                                </p>
                                {hasQuestions && currentQuestion.reference && currentQuestion.reference !== '#' && (
                                    <a
                                        href={currentQuestion.reference}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.referenceLink}
                                    >
                                        학습 자료 보기 <PhosphorArrowUpRight />
                                    </a>
                                )}
                            </div>
                        </div>
                    </main>

                    <footer className={styles.footer}>
                        <button
                            className={styles.toggleAnswerBtn}
                            onClick={handleToggleAnswer}
                            disabled={!hasQuestions}
                        >
                            {showAnswer ? '답변 숨기기' : '답변 보기'}
                        </button>
                        <button
                            className={styles.nextQuestionBtn}
                            onClick={handleNextQuestion}
                            disabled={!hasQuestions}
                        >
                            다음 질문
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default App;