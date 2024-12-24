import React, { useState } from "react";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        setError("");
        if (newPassword !== confirmPassword) {
            setError("הסיסמאות לא זהות");
            return;
        }
        console.log(newPassword); 
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>איפוס סיסמה</h2>
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
