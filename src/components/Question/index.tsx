import style from './style.module.css';

import { CommonQuestionType } from '@/types';

interface QuestionProps {
    Questions: CommonQuestionType[];
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