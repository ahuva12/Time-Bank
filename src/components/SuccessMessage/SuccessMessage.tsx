
import React, { useState } from 'react';
import styles from './SuccessMessage.module.css';
import { FaCheckCircle } from 'react-icons/fa';

interface SuccessMessageProps {
    message_line1: string;
    message_line2: string;
    message_line3?: string;
    message_line4?:string
    onOkClick?: Function; // Function to call when OK is clicked
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message_line1, message_line2, message_line3, message_line4, onOkClick }) => {
    const [isShow, setIsShow] = useState<boolean>(true);

    const handleOkClick = () => {
        setIsShow(false); // Hide the success message
        if (onOkClick) // If onOkClick function exists, call it
            onOkClick();
    };

    return (
        isShow && (
            <div className={styles.overlay}>
                <div className={styles.modalSucc}>
                    <button className={styles.closeButton} onClick={handleOkClick}>
                        ✕
                    </button>
                    <div className={styles.iconSucc}>
                        <FaCheckCircle color="#11b823" size={50} />
                    </div>
                    <p className={styles.textSucc}>
                        {message_line1}
                        <br />
                        {message_line2}
                        {message_line3 && (
                            <>
                                <br />
                                {message_line3}
                            </>
                        )}
                        <br />
                        {message_line4}
                    </p>
                    <button className={styles.buttonSucc} onClick={handleOkClick}>
                        OK
                    </button>
                </div>
            </div>
        )
    );
};

export default SuccessMessage;
