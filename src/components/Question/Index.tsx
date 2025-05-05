import style from './style.module.css';

interface ProjectQuestion {
    id: number;
    projectName: string;
    question: string;
    purpose: string;
}

interface QuestionProps {
    Questions: ProjectQuestion[];
}

const QuestionList = ({ Questions }: QuestionProps) => {
    return (
        <ul className={style.list_box}>
            {Questions.map((item) => (
                <li key={item.id}>
                    {item.question}
                </li>
            ))}
        </ul>
    );
};

export default QuestionList;