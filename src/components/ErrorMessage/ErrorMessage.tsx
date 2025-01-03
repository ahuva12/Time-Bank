import React, { useState } from 'react';
import styles from './ErrorMessage.module.css';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useRouter } from 'next/navigation';

interface ErrorMessageProps {
    message_line1: string; 
    message_line2: string; 
    message_line3?: string; 
    link?: string;
    onOkClick?: Function; 
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message_line1, message_line2, message_line3, link, onOkClick }) => {

    const [isShow, setIsShow] = useState<boolean>(true);
    const router = useRouter(); 

    const handleRedirect = () => {
        setIsShow(false);
        if (link)
            router.push(link); 
        if (onOkClick) 
            onOkClick();
    }; 
    
    return (
        isShow && (
            <div className={styles.overlay}>
                <div className={styles.modalSucc}>
                    <button className={styles.closeButton} onClick={handleRedirect}>
                        ✕
                    </button>
                    <div className={styles.iconSucc}>
                        <AiOutlineCloseCircle color="#FF4C4C" size={50} />
                    </div>
                    <p className={styles.text}>
                        {message_line1}
                        <br />
                        {message_line2}
                        {message_line3 && (
                            <>
                                <br />
                                {message_line3}
                            </>
                        )}
                    </p>
                    <button className={styles.buttonSucc} onClick={handleRedirect}>
                        OK
                    </button>
                </div>
            </div>
        )
    );
};
export default ErrorMessage;