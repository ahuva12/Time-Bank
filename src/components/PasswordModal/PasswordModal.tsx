import React, { useState } from "react";
import styles from "./PasswordModal.module.css"; // Style file for the modal
import bcrypt from 'bcryptjs';
import { User } from "@/types/user";
import { verifyPassword } from "@/services/utils";

interface PasswordModalProps {
    onClose: () => void;
    onSubmit: (newPassword: string) => void;
    user: User
}

const saltRounds = 10; // Number of salt rounds for bcrypt

const PasswordModal: React.FC<PasswordModalProps> = ({
    onClose,
    onSubmit,
    user,
}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!await verifyPassword(oldPassword, user.password as string)) {
            setError("הסיסמא הנוכחית לא נכונה");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("הסיסמאות החדשות לא תואמות");
            return;
        }
        if (oldPassword === newPassword) {
            setError("הסיסמא החדשה זהה לסיסמא הישנה");
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        onSubmit(hashedPassword);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖
                </button>
                <h2 className={styles.title}>שינוי סיסמה</h2>
                <div className={styles.formGroup}>
                    <label>סיסמה נוכחית:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="הזן סיסמה נוכחית"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>סיסמה חדשה:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="הזן סיסמה חדשה"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>אשר סיסמה חדשה:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="אשר סיסמה חדשה"
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.buttonsContainer}>
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        שנה סיסמה
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;