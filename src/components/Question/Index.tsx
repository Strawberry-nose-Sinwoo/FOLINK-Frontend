import style from './style.module.css';

interface CommonQuestion {
    id: number;
    title: string;
    question: string;
    purpose: string;
}

interface QuestionProps {
    Questions: CommonQuestion[];
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