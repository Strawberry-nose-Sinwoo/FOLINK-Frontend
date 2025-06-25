import * as components from '@/allFiles';
import style from './style.module.css';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoProject } from "react-icons/go";
import { PiFileCode } from "react-icons/pi";
import { ArrowLeft } from '@/assets';
import { CommonQuestionType } from '@/types';
import { Toastify } from '@/allFiles';
import { useGetQuestion } from '@/hooks';

interface GroupedQuestions {
  projectQuestions: { [key: string]: CommonQuestionType[] };
  techStackQuestions: { [key: string]: CommonQuestionType[] };
}

const Question = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetQuestion(questionId);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState<'loading' | 'success'>('loading');

  const groupedQuestions: GroupedQuestions | undefined = response?.data?.id
    ? (() => {
        const { projectQuestions, techStackQuestions } = response.data;

        const groupBy = (list: any[], key: string): { [key: string]: CommonQuestionType[] } =>
          list.reduce((acc: { [key: string]: CommonQuestionType[] }, item) => {
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
          projectQuestions: groupBy(projectQuestions, 'projectName'),
          techStackQuestions: groupBy(techStackQuestions, 'stackName'),
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

  const flattenedQuestions = {
  ...Object.entries(groupedQuestions.projectQuestions).reduce((acc, [key, questions]) => {
    acc[key] = questions;
    return acc;
  }, {} as { [key: string]: CommonQuestionType[] }),
  ...Object.entries(groupedQuestions.techStackQuestions).reduce((acc, [key, questions]) => {
    acc[key] = questions;
    return acc;
  }, {} as { [key: string]: CommonQuestionType[] }),
};

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
      <div className={style.questions_wrapper}>
        <div className={style.list_container}>
          <h2 className={style.section_title}>
            <GoProject />
            프로젝트 질문
          </h2>
          <div className={style.list_container_2}>
            {Object.entries(groupedQuestions.projectQuestions).map(
              ([title, questions]) => (
                <div className={style.list_container_3} key={title}>
                  <div className={style.title_box}>
                    <h3 className={style.title}>{title}</h3>
                  </div>
                  <components.QuestionList Questions={questions} />
                </div>
              )
            )}
          </div>
        </div>
        <div className={style.list_container}>
          <h2 className={style.section_title}>
            <PiFileCode />
            기술 스택 질문
          </h2>
          <div className={style.list_container_2}>
            {Object.entries(groupedQuestions.techStackQuestions).map(
              ([title, questions]) => (
                <div className={style.list_container_3} key={title}>
                  <div className={style.title_box}>
                    <h3 className={style.title}>{title}</h3>
                  </div>
                  <components.QuestionList Questions={questions} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
        <button
          className={style.answer_button}
          onClick={() => navigate('/chat', { state: flattenedQuestions })}
        >
          답변 하기
        </button>
    </div>
  );
};

export default Question;