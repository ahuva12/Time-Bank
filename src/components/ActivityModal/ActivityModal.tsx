'use client'
import { FaCheckCircle } from 'react-icons/fa';
import styles from "./ActivityModal.module.css";
import { Activity } from "@/types/activity";
import { User } from "@/types/user";
import { calculateAge } from "@/services/utils";
import { CiUser } from "react-icons/ci";
import {ErrorMessage, SuccessMessage} from '@/components';

interface ActivityModalProps {
    modeModel: string;
    isModeCancellig:boolean;
    onClose: () => void;
    activity: Activity;
    user: User | null;
    handlesMoreOptions: {
        handleAcceptActivity?: () => void;
        handleCancellRequestActivity?: () => void;
        handleRequesterDetails?: () => void;
        handleUpdateActivity?: () => void;
        handleCancellProposalActivity?: () => void;
    };
}

const ActivityModal: React.FC<ActivityModalProps> = ({ modeModel, isModeCancellig, onClose, activity, user, handlesMoreOptions }) => {
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
            <ErrorMessage message_line1="משהו השתבש... פעולתך נכשלה" message_line2='תוכל לנסות שוב במועד מאוחר יותר'/>
        );
    };

    const successModal = () => {
        if (handlesMoreOptions.handleAcceptActivity && !isModeCancellig) {
            return (
                <SuccessMessage
                    message_line1="שמחים שנהנית :)"
                    message_line2={`יתרת השעות שלך עומדת על: ${user?.remainingHours}`}
                    message_line3={`תמיד נשמח לקבל משוב על הפעילות במייל TimeBank@gmail.com`}
                />
            );
        }
    
        if (handlesMoreOptions.handleCancellRequestActivity && isModeCancellig) {
            return (
                <SuccessMessage
                    message_line1="ביטול הפעילות התקבל בהצלחה"
                    message_line2={`יתרת השעות שלך עודכנה ל: ${user?.remainingHours}`}
                />
            );
        }
    
        if (handlesMoreOptions.handleUpdateActivity && isModeCancellig) {
            return (
                <SuccessMessage
                    message_line1="עדכון פרטי הפעילות התבצע בהצלחה"
                    message_line2={`תמיד נשמח לקבל פרגונים במייל TimeBank@gmail.com`}
                />
            );
        }
    
        if (handlesMoreOptions.handleCancellProposalActivity && !isModeCancellig) {
            return (
                <SuccessMessage
                    message_line1="הפעילות שלך נמחקה בהצלחה"
                    message_line2={`תמיד נשמח לקבל פרגונים במייל TimeBank@gmail.com`}
                />
            );
        }
    
        if (handlesMoreOptions.handleRequesterDetails) {
            return (
                <SuccessMessage
                    message_line1="תודה על התעניינותך"
                    message_line2="הודענו על כך למבצע הפעילות"
                    message_line3={`תוכל ליצור איתו קשר במייל: ${user?.email}`}
                />
            );
        }
    
        return null; 
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
                                <p className={styles.text}>{user?.firstName} {user?.lastName}</p>
                                <p className={styles.text}>{user?.gender === "male" ? "בן" : "בת"} {calculateAge(user?.dateOfBirth ?? "0")}</p>
                                <p className={styles.text}>{user?.address}</p>
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
            {modeModel.startsWith('success') && successModal()}
            {modeModel === 'error' && errorModal()}
        </>
    );
};

export default ActivityModal;
