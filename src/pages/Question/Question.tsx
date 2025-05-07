import * as components from "@/allFiles";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import style from './style.module.css';
import arrowback from '../../assets/arrow-point-to-right 2.png'

interface ProjectQuestion {
    id: number;
    projectName: string;
    question: string;
    purpose: string;
}

interface TechStackQuestion {
    id: number;
    stack: string;
    question: string;
    purpose: string;
}

interface CommonQuestion {
    id: number;
    title: string;
    question: string;
    purpose: string;
}

interface GroupedQuestions {
    [key: string]: CommonQuestion[];
}

const Question = () => {
    const location = useLocation();
    const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({});

    const navigate = useNavigate()

    useEffect(() => {
        if (location.state) {
            const projectQuestions = location.state.projectQuestions.reduce((acc: GroupedQuestions, item: ProjectQuestion) => {
                const { projectName } = item;
                if (acc[projectName] == undefined) acc[projectName] = [];
                acc[projectName].push({
                    id: item.id,
                    title: item.projectName,
                    question: item.question,
                    purpose: item.purpose
                });
                return acc;
            }, {});

            const techStackQuestions = location.state.techStackQuestions.reduce((acc: GroupedQuestions, item: TechStackQuestion) => {
                const { stack } = item;
                if (acc[stack] == undefined) acc[stack] = [];
                acc[stack].push({
                    id: item.id,
                    title: item.stack,
                    question: item.question,
                    purpose: item.purpose
                });
                return acc;
            }, {});

            setGroupedQuestions(Object.assign(projectQuestions, techStackQuestions));
        }
    }, [location.state]);

    return (
        <div className={style.container}>
            <img className={style.back_button} src={arrowback} alt="" onClick={() => navigate(-1)} />
            <h1 className={style.main_text}>포트폴리오 기반으로 질문을 만들어 봤어요.</h1>
            <div className={style.list_container}>
                {Object.entries(groupedQuestions).map(([projectName, questions]) => (
                    <div className={style.list_container_2} key={projectName}>
                        <div className={style.title_box}>
                            <h2>{projectName}</h2>
                        </div>
                        <components.QuestionList Questions={questions} />
                    </div>
                ))}
            </div>
            <button onClick={() => {
                navigate('/chat', { state:  groupedQuestions})
            }} className={style.answer_button}>답변 하기</button>
        </div>
    );
};

export default Question;
