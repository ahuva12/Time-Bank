import React, { useState } from 'react';
import styles from './WarningMessage.module.css';
import { IoWarning } from "react-icons/io5";

interface WarningMessageProps {
    message: string; 
    okfunction: () => void;
    setIsWarningMessage: (value: boolean) => void;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message, okfunction, setIsWarningMessage }) => {
    
    return (
        (
            <div className={styles.overlay}>
                <div className={styles.modalSucc}>
                    <button className={styles.closeButton} onClick={() => setIsWarningMessage(false)}>
                        ✕
                    </button>
                    <div className={styles.iconSucc}>
                        <IoWarning color="#FFB300" size={58} />
                    </div>
                    <p className={styles.text}>
                        {message}
                    </p>
                    <div className={styles.buttons}>
                        <button className={styles.okButton} onClick={okfunction}>
                            אישור
                        </button>
                        <button className={styles.cancellButton} onClick={() => setIsWarningMessage(false)}>
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};
export default WarningMessage;