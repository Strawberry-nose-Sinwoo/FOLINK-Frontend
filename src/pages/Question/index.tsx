import * as components from '@/allFiles';
import style from './style.module.css';

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from '@/assets';
import { CommonQuestionType } from '@/types';
import { Toastify } from '@/allFiles';
import { useGetQuestion } from '@/hooks';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

interface GroupedQuestions {
  [key: string]: CommonQuestionType[];
}

const Question = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetQuestion(questionId);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState<'loading' | 'success'>(
    'loading'
  );

  const groupedQuestions: GroupedQuestions | undefined = response?.data?.id
    ? (() => {
        const { projectQuestions, techStackQuestions } = response.data;

        const groupBy = (list: any[], key: string): GroupedQuestions =>
          list.reduce((acc: GroupedQuestions, item) => {
            const groupKey = item[key];
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push({
              id: item.id,
              title: item[key],
              question: item.question,
              purpose: item.purpose,
              conversationId: item.conversationId,
            });
            return acc;
          }, {});

        return {
          ...groupBy(projectQuestions, 'projectName'),
          ...groupBy(techStackQuestions, 'stackName'),
        };
      })()
    : undefined;

  useEffect(() => {
    if (isLoading) {
      setIsLoadingState(true);
      setLoadingStatus('loading');
    } else if (error) {
      setIsLoadingState(false);
      Toastify({
        type: 'error',
        message: '질문 세트를 불러오는데 실패했습니다.',
        toastId: 'fetch-questions-error',
      });
      setTimeout(() => navigate(-1), 1500);
    } else if (!groupedQuestions) {
      setIsLoadingState(false);
      Toastify({
        type: 'error',
        message: '질문 데이터가 없습니다.',
        toastId: 'no-questions',
      });
      setTimeout(() => navigate(-1), 1500);
    } else {
      setLoadingStatus('success');
      setTimeout(() => {
        setIsLoadingState(false); 
      }, 1000); 
    }
  }, [isLoading, error, groupedQuestions, navigate]);

  if (isLoadingState) {
    return <components.Loading status={loadingStatus} />;
  }

  if (!groupedQuestions) {
    return null;
  }

  return (
    <div className={style.container}>
      <img
        className={style.back_button}
        src={ArrowLeft}
        alt="뒤로 가기"
        onClick={() => navigate(-1)}
      />
      <h1 className={style.main_text}>
        포트폴리오 기반으로 질문을 만들어 봤어요.
      </h1>
      <div className={style.list_container}>
        {Object.entries(groupedQuestions).map(([title, questions]) => (
          <div className={style.list_container_2} key={title}>
            <div className={style.title_box}>
              <h2 className={style.title}>{title}</h2>
            </div>
            <components.QuestionList Questions={questions} />
          </div>
        ))}
      </div>
      <Button 
        onClick={() => navigate('/chat', { state: groupedQuestions })}
        variant={'outline'}
      >
        답변 하기
      </Button>
    </div>
  );
};

export default Question;
