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

interface GroupedQuestions {
    [key: string]: ProjectQuestion[];
}

const Question = () => {
    const location = useLocation();
    const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({});

    const navigate = useNavigate()

    useEffect(() => {
        if (location.state && Array.isArray(location.state)) {
            const grouped = location.state.reduce((acc: GroupedQuestions, item: ProjectQuestion) => {
                const { projectName } = item;
                if (!acc[projectName]) acc[projectName] = [];
                acc[projectName].push(item);
                return acc;
            }, {});
            setGroupedQuestions(grouped);
        }
    }, [location.state]);

    return (
        <div className={style.container}>
            <img className={style.back_button} src={arrowback} alt="" onClick={() => navigate(-1)} />
            <h1 className={style.main_text}>포트폴리오 기반으로 질문을 만들어 봤어요.</h1>
            <div className={style.list_container}>
                {Object.entries(groupedQuestions).map(([projectName, questions], index) => (
                    <div className={style.list_container_2} key={projectName}>
                        <div className={style.title_box}>
                            <h2>{projectName}</h2>
                        </div>
                        <components.QuestionList Questions={questions} />
                    </div>
                ))}
            </div>
            <button className={style.answer_button}>답변 하기</button>
        </div>
    );
};

export default Question;
