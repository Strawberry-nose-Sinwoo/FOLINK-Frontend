import { Toastify } from "@/allFiles"
import styles from "./style.module.css"

export default function Main() {
    const toastOnClick = () => {
        Toastify({
        type: "loading",
        message: "데이터를 불러오는 중입니다...",
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.title_container}>
                    <h1>포트폴리오 내용으로 예상 면접 질문을 받아보세요!</h1>
                </div>
                <div className={styles.chat_container}>
                    <input type="text" className={styles.chat_input} placeholder="포트폴리오 내용을 입력하세요."/>
                    <div className={styles.btn_container}>
                        <input
                         type="file"
                         accept="application/pdf"
                        />
                        <button onClick={toastOnClick}>전송</button>
                    </div>
                </div>
            </div>
        </div>
    )
}   