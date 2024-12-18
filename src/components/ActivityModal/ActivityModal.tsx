'use client'
import { FaCheckCircle } from 'react-icons/fa';
import styles from "./ActivityModal.module.css";
import { Activity } from "@/types/activity";
import { User } from "@/types/user";
import { calculateAge } from "@/services/utils";
import { CiUser } from "react-icons/ci";
import { ErrorMessage, SuccessMessage, MiniLoader } from '@/components';
import { useEffect, useState } from 'react';
import { getUserById } from '@/services/users'

interface ActivityModalProps {
    modeModel: string;
    isModeCancellig: boolean;
    onClose: () => void;
    activity: Activity;
    user: User | null;
    giver_receiver_details? : User
    isNeedUserDetails: boolean
    handlesMoreOptions: {
        handleAcceptActivity?: () => void;
        handleCancellRequestActivity?: () => void;
        handleRegistrationActivity?: () => void;
        handleUpdateActivity?: () => void;
        handleCancellProposalActivity?: () => void;
    };
}

const ActivityModal: React.FC<ActivityModalProps> = ({ modeModel, isModeCancellig, onClose, activity, user, giver_receiver_details, isNeedUserDetails, handlesMoreOptions }) => {
    console.log(giver_receiver_details)
    if (modeModel === 'close') return null;
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [loadingUserDetails, setLoadingUserDetails] = useState<boolean>(true);

    // useEffect(() => {
    //     const fetchUserDetails = async () => {
    //         try {
    //             let userId = user?._id;
    //             if (activity.giverId !== user?._id)
    //                 userId = activity.giverId; // Check recipient first, fallback to giver
    //             else if (activity.receiverId)
    //                 userId = activity.receiverId;
    //             else {
    //                 setUserDetails(null);
    //                 return;
    //             }
    //             if (userId) {
    //                 const user = await getUserById(userId as string); // Fetch user details
    //                 setUserDetails(user);
    //             } else {
    //                 setUserDetails(null);
    //             }
    //         } catch (err) {
    //             console.error("Failed to fetch user details:", err);
    //             // setError("Failed to fetch user details. Please try again.");
    //         } finally {
    //             setLoadingUserDetails(false);
    //         }
    //     };

    //     fetchUserDetails();
    // }, []);
    useEffect(()=> {
        setLoadingUserDetails(false)
    }, [giver_receiver_details])

    const renderButtons = () => {
        const buttonConfig = [
            { handler: handlesMoreOptions.handleAcceptActivity, label: 'קיבלתי', block: false },
            { handler: handlesMoreOptions.handleCancellRequestActivity, label: 'ביטול', block: false },
            { handler: handlesMoreOptions.handleRegistrationActivity, label: 'אני מעוניין בפעילות זו', block: !user?.remainingHours || user.remainingHours < activity.durationHours },
            { handler: handlesMoreOptions.handleUpdateActivity, label: 'עדכון', block: false },
            { handler: handlesMoreOptions.handleCancellProposalActivity, label: 'מחיקה', block: false },
        ];

        return (
            <div className={styles.buttonsContainer}>
                {buttonConfig.map((button, index) => (
                    button.handler && (
                        <button
                            key={index}
                            className={`${styles.moreOptionButton} ${button.block ? styles.disabledButton : ''
                                }`}
                            onClick={button.handler}
                            disabled={button.block} // Disable the button if the condition is true
                        >
                            {button.label}
                        </button>
                    )
                ))}
            </div>
        );
    };

    const errorModal = () => {
        return (
            <ErrorMessage message_line1="משהו השתבש... פעולתך נכשלה" message_line2='תוכל לנסות שוב במועד מאוחר יותר' />
        );
    };

    const successModal = () => {
        if (handlesMoreOptions.handleAcceptActivity && !isModeCancellig) {
            return (
                <SuccessMessage
                    message_line1="שמחים שנהנית :)"
                    message_line2={`יתרת השעות שלך עומדת על: ${user?.remainingHours}`}
                    message_line3={`תמיד נשמח לקבל משוב על הפעילות במייל Timerepublic@gmail.com`}
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
                    message_line2={`תמיד נשמח לקבל פרגונים במייל Timerepublic@gmail.com`}
                />
            );
        }

        if (handlesMoreOptions.handleCancellProposalActivity && !isModeCancellig) {
            return (
                <SuccessMessage
                    message_line1="הפעילות שלך נמחקה בהצלחה"
                    message_line2={`תמיד נשמח לקבל פרגונים במייל Timerepublic@gmail.com`}
                />
            );
        }

        if (handlesMoreOptions.handleRegistrationActivity) {
            // return (
            //     <SuccessMessage
            //         message_line1="נרשמת לפעילות בהצלחה!"
            //         message_line2={`הודענו על כך ל${userDetails?.firstName} ${userDetails?.lastName}`}
            //         message_line3={
            //             userDetails?.gender === 'female'
            //                 ? `תוכל ליצור איתה קשר בטלפון: ${userDetails?.phoneNumber}`
            //                 : `תוכל ליצור איתו קשר בטלפון: ${userDetails?.phoneNumber}`
            //         }
            //         message_line4={`או במייל ${userDetails?.email}`}
            //     />
            // );
            return (
                <SuccessMessage
                    message_line1="נרשמת לפעילות בהצלחה!"
                    message_line2={`הודענו על כך ל${giver_receiver_details?.firstName} ${giver_receiver_details?.lastName}`}
                    message_line3={
                        giver_receiver_details?.gender === 'female'
                            ? `תוכל ליצור איתה קשר בטלפון: ${giver_receiver_details?.phoneNumber}`
                            : `תוכל ליצור איתו קשר בטלפון: ${giver_receiver_details?.phoneNumber}`
                    }
                    message_line4={`או במייל ${giver_receiver_details?.email}`}
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
                                    <div className={`${styles.text} ${styles.textLimited}`}>{activity.description}</div>
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

                        <div>
                            <div className={styles.userDetailsDescription}>
                                <div className={styles.profileIcon}>
                                    <CiUser className={styles.icon} />
                                </div>
                                {!isNeedUserDetails ? (
                                    <p>אף אחד עדיין לא בחר את הפעילות הזאת</p>
                                ) : giver_receiver_details ? (
                                    <div className={styles.description}>
                                        <p className={styles.text}>{giver_receiver_details?.firstName} {giver_receiver_details?.lastName}</p>
                                        <p className={styles.text}>{giver_receiver_details?.address}</p>
                                        <p className={styles.text}>{giver_receiver_details?.email}</p>
                                    </div>
                                ) : (
                                    <div className={styles.loader}>
                                        <MiniLoader />
                                        <div className={styles.loaderTest}>טוען פרטי משתמש...</div>
                                    </div>                                
                                )}
                                {/* {loadingUserDetails ? (
                                    <div className={styles.loader}>
                                        <MiniLoader />
                                        <div className={styles.loaderTest}>טוען פרטי משתמש...</div>
                                    </div>
                                ) : giver_receiver_details ? (
                                    <div className={styles.description}>
                                        <p className={styles.text}>{giver_receiver_details?.firstName} {giver_receiver_details?.lastName}</p>
                                        <p className={styles.text}>{giver_receiver_details?.address}</p>
                                        <p className={styles.text}>{giver_receiver_details?.email}</p>
                                    </div>
                                ) : (
                                    <p>אף אחד עדיין לא בחר את הפעילות הזאת</p>
                                )} */}
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
