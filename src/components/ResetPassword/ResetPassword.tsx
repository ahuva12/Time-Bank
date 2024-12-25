import React, { useState } from "react";
import styles from "./ResetPassword.module.css";
import { updateUser } from "@/services/users";
import { User } from "@/types/user";
import { ErrorMessage, MiniLoader } from '@/components';
import bcrypt from 'bcryptjs';

interface ResetPasswordProps {
    user: User;
    onClose: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ user, onClose }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isErrorMessage, setIsErrorMessage] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const saltRounds = 10; 

    const handleSubmit = async () => {
        setError("");
        if (newPassword !== confirmPassword) {
            setError("הסיסמאות לא זהות");
            return;
        }
        try {
            setIsLoader(true);
            console.log(newPassword); 
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            const updatedUser = { ...user, password: hashedPassword };
            const response = await updateUser(updatedUser);
            onClose()
        } catch(error) {
            console.log(error);
            setIsErrorMessage(true);
        } finally {
            setIsLoader(false);
        }
    };

    if (isErrorMessage) {
        return (
          <ErrorMessage
            message_line1='אופס... משהו השתבש'
            message_line2='נסה שוב במועד מאוחר יותר'
            onOkClick={()=>setIsErrorMessage(false)}
          />
        );
      }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>איפוס סיסמה</h2>
                {isLoader && (
                <div className={styles.loader}>
                <MiniLoader />
                </div>
                )}  
                <div onClick={onClose}>X</div>
                <div className={styles.formGroup}>
                    <label>סיסמה בחר:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="הזן סיסמה"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>אשר סיסמה:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="אשר סיסמה"
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.buttonsContainer}>
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        אפס סיסמה
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
