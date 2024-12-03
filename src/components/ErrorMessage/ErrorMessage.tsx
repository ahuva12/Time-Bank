import React, { useState } from 'react';
import styles from './ErrorMessage.module.css';
import { AiOutlineCloseCircle } from "react-icons/ai";

interface ErrorMessageProps {
    message_line1: string; 
    message_line2: string; 
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message_line1, message_line2 }) => {

    const [isShow, setIsShow] = useState<boolean>(true)
    
    return (
        isShow && (
            <div className={styles.overlay}>
                <div className={styles.modalSucc}>
                    <button className={styles.closeButton} onClick={() => setIsShow(false)}>
                        ✕
                    </button>
                    <div className={styles.iconSucc}>
                        <AiOutlineCloseCircle color="#FF4C4C" size={50} />
                    </div>
                    <p className={styles.textSucc}>
                        {message_line1}
                        <br />
                        {message_line2}
                    </p>
                    <button className={styles.buttonSucc} onClick={() => setIsShow(false)}>
                        OK
                    </button>
                </div>
            </div>
        )
    );
};


export default ErrorMessage;
