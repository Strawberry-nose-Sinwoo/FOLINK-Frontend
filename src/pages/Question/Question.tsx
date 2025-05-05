import * as components from "@/allFiles";
import { useState } from "react";
import style from './style.module.css'

interface ProjectQuestion {
    id: number;
    projectName: string;
    question: string;
    purpose: string;
}

const demo = [
    {
        "id": 121,
        "projectName": "프론트엔드",
        "question": "해당 프론트엔드 프로젝트에서 React를 선택한 이유는 무엇인가요?",
        "purpose": "기술 선택"
    },
    {
        "id": 122,
        "projectName": "프론트엔드",
        "question": "프론트엔드 프로젝트에서 React 컴포넌트의 상태 관리를 어떻게 구현했나요? 구체적인 방법을 설명해주세요.",
        "purpose": "구현 방식"
    },
    {
        "id": 123,
        "projectName": "프론트엔드",
        "question": "React를 사용하면서 성능 문제를 겪은 적이 있나요? 있다면 어떻게 해결했나요?",
        "purpose": "문제 해결"
    },
    {
        "id": 124,
        "projectName": "프론트엔드",
        "question": "React를 사용하여 개발한 프론트엔드 프로젝트의 성능을 어떻게 측정하고 개선했나요? 구체적인 지표와 개선 방법을 설명해주세요.",
        "purpose": "성과 평가"
    }
]

const Question = () => {

    const [question, setQuestion] = useState<ProjectQuestion[]>(demo)

    return (
        <div className={style.container}>
            <h1 className={style.main_text}>포트폴리오 기반으로 질문을 만들어 봤어요.</h1>
            <div className={style.list_container}>
                <div className={style.list_container_2}>
                    <div className={style.title_box}>
                        <h2>나의 프로젝트 1</h2>
                    </div>
                    <components.QuestionList Questions={question} />
                </div>
                <div className={style.list_container_2}>
                    <div className={style.title_box}>
                        <h2>나의 프로젝트 2</h2>
                    </div>
                    <components.QuestionList Questions={question} />
                </div>
            </div>
            <button className={style.answer_button}>답변 하기</button>
        </div>
    )
}

export default Question