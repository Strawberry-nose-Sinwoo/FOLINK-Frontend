import { useNavigate } from 'react-router-dom'
import styles from './style.module.css'
import { useEffect, useState } from 'react'

interface propsTypes {
  chatId: number
}

export default function LastQuestioonModal() {
  const id = localStorage.getItem("question_history")
  const [history, setHistory] = useState<boolean>(false)
  const navigate = useNavigate()

  const canccleHistory = () => {
    localStorage.removeItem("question_history")
    setHistory(false)
  }

  const requestHistory = () => {
    navigate(`/question/${id}`)
  }

  useEffect(() => {
    if (id === null) {
      setHistory(false)
    } else {
      setHistory(true)
    }
  }, [localStorage.getItem("question_history")])

  return (
    <div className={ history === true ? styles.container : styles.closeContainer}>
      <h3 className={styles.text}>
        <span>🔔</span> 이전에 진행하던 질문이 있어요!
      </h3>
      <div className={styles.selectContainer}>
        <button onClick={() => canccleHistory()} >X</button>
        <button onClick={() => requestHistory()}>진행하기</button>
      </div>
    </div>
  )
}