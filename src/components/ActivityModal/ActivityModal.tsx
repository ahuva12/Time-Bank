'use client'
import React, { use, useState } from "react";
import { FaCheckCircle } from 'react-icons/fa';

import styles from "./ActivityModal.module.css";
import { Activity } from "@/types/activity";
import { User } from "@/types/user";
import { calculateAge } from "@/services/utils";
interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity;
    user: User;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, activity, user }) => {
    if (!isOpen) return null;
    const [isSuccess, setIsSuccess] = useState(false);

    const handleIntrested = () => {
        setIsSuccess(true);
    };


    const successModal = () => {
        return (
            <div className={styles.overlay}>
                <div className={styles.modalSucc}>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                    <div className={styles.iconSucc}>
                        <FaCheckCircle color="#11b823" size={50} />
                    </div>
                    <p className={styles.textSucc}>
                        תודה על התעניינותך!
                        <br />
                        הודענו על כך למבצע הפעילות
                        תוכל ליצור איתו קשר במייל: {user.email}</p>
                    <button className={styles.buttonSucc} onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        );
    };

    const activityModalOpen = () => {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                    <h2 className={styles.title}>פרטי פעילויות</h2>
                    <div className={styles.wrapperRow}>
                        <div className={styles.content}>
                            <div className={styles.description}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>שם ההפעילות</label>
                                    <div className={styles.text}>{activity.nameActivity}</div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>תיאור</label>
                                    <div className={styles.text}>{activity.description}</div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>מספר שעות</label>
                                    <div className={styles.text}>{activity.durationHours} שעות</div>
                                </div>
                                <div className={styles.tagsContainer}>
                                    {activity.tags.map((tag, index) => (
                                        <span key={index} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className={styles.content}>
                            <div className={styles.icon}>
                                <div className={styles.profileIcon}></div>
                                <p>{user.firstName} {user.lastName}</p>
                                <p>{user.gender === "male" ? "בן" : "בת"} {calculateAge(user.dateOfBirth)}</p>
                                <p>{user.address}</p>
                            </div>
                        </div>
                    </div>
                    <button className={styles.submitButton} onClick={handleIntrested}>אני מעוניין בפעילות זו</button>
                </div>
            </div>
        );
    };

    return isSuccess ? successModal() : activityModalOpen();

};
