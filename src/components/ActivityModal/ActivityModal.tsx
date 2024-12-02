'use client'
import { FaCheckCircle } from 'react-icons/fa';
import styles from "./ActivityModal.module.css";
import { Activity } from "@/types/activity";
import { User } from "@/types/user";
import { calculateAge } from "@/services/utils";
import { CiUser } from "react-icons/ci";

interface ActivityModalProps {
    modeModel: string;
    onClose: () => void;
    activity: Activity;
    user: User;
    handlesMoreOptions: {
        handleAcceptActivity?: () => void;
        handleCancellRequestActivity?: () => void;
        handleRequesterDetails?: () => void;
        handleUpdateActivity?: () => void;
        handleCancellProposalActivity?: () => void;
    };
}

const ActivityModal: React.FC<ActivityModalProps> = ({ modeModel, onClose, activity, user, handlesMoreOptions }) => {
    if (modeModel === 'close') return null;

    const renderButtons = () => {
        const buttonConfig = [
            { handler: handlesMoreOptions.handleAcceptActivity, label: 'קיבלתי' },
            { handler: handlesMoreOptions.handleCancellRequestActivity, label: 'ביטול' },
            { handler: handlesMoreOptions.handleRequesterDetails, label: 'אני מעוניין בפעילות זו' },
            { handler: handlesMoreOptions.handleUpdateActivity, label: 'עדכון' },
            { handler: handlesMoreOptions.handleCancellProposalActivity, label: 'מחיקה' },
        ];

        return (
            <div className={styles.buttonsContainer}>
                {buttonConfig.map(
                    (button, index) =>
                        button.handler && (
                            <button
                                key={index}
                                className={styles.moreOptionButton}
                                onClick={button.handler}
                            >
                                {button.label}
                            </button>
                        )
                )}
            </div>
        );
    };

    const errorModal = () => {
        return (
            <div>error in model</div>
        );
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
                        הודענו על כך למבצע הפעילות.
                        <br />
                        תוכל ליצור איתו קשר במייל: {user.email}
                    </p>
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
                            <div className={styles.description}>
                                <div className={styles.profileIcon}>
                                    <CiUser className={styles.icon} />
                                </div>
                                <p className={styles.text}>{user.firstName} {user.lastName}</p>
                                <p className={styles.text}>{user.gender === "male" ? "בן" : "בת"} {calculateAge(user.dateOfBirth)}</p>
                                <p className={styles.text}>{user.address}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        {renderButtons()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {modeModel === 'open' && activityModalOpen()}
            {modeModel === 'success' && successModal()}
            {modeModel === 'error' && errorModal()}
        </>
    );
};

export default ActivityModal;
