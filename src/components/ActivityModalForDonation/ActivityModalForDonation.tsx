// 'use client';

// import { FaCheckCircle } from 'react-icons/fa';
// import styles from "./ActivityModalForDonation.module.css";
// import { Activity } from "@/types/activity";
// import { User } from "@/types/user";
// import { calculateAge } from "@/services/utils";
// import { CiUser } from "react-icons/ci";
// import { ErrorMessage, SuccessMessage } from '@/components';
// import { useEffect, useState } from 'react';
// import { getUserById } from '@/services/users'; // Updated import

// interface ActivityModalForDonationProps {
//     modeModel: string;
//     onClose: () => void;
//     activity: Activity;
// }

// const ActivityModalForDonation: React.FC<ActivityModalForDonationProps> = ({ modeModel, onClose, activity }) => {
//     const [recipient, setRecipient] = useState<User | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchRecipient = async () => {
//             try {
//                 setLoading(true);
//                 const user = await getUserById(activity.receiverId as string); // Use getUserById
//                 setRecipient(user); // Assuming Axios response contains the user in `data`
//             } catch (err) {
//                 console.error("Failed to fetch recipient:", err);
//                 // setError("Failed to fetch recipient details. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecipient();
//     }, [activity.receiverId]);

//     const errorModal = () => (
//         <ErrorMessage 
//             message_line1="משהו השתבש... פעולתך נכשלה" 
//             message_line2='תוכל לנסות שוב במועד מאוחר יותר' 
//         />
//     );

//     const successModal = () => (
//         <SuccessMessage
//             message_line1="פרטי הפעילות נשלחו בהצלחה"
//             message_line2="ניתן ליצור קשר עם המשתמש לפרטים נוספים"
//         />
//     );

//     const activityModalOpen = () => (
//         <div className={styles.overlay}>
//             <div className={styles.modal}>
//                 <button className={styles.closeButton} onClick={onClose}>
//                     ✕
//                 </button>
//                 <h2 className={styles.title}>פרטי פעילויות</h2>
//                 <div className={styles.wrapperRow}>
//                     <div className={styles.content}>
//                         <div className={styles.description}>
//                             <div className={styles.formGroup}>
//                                 <label className={styles.label}>שם ההפעילות</label>
//                                 <div className={styles.text}>{activity.nameActivity}</div>
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label className={styles.label}>תיאור</label>
//                                 <div className={styles.text}>{activity.description}</div>
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label className={styles.label}>מספר שעות</label>
//                                 <div className={styles.text}>{activity.durationHours} שעות</div>
//                             </div>
//                             <div className={styles.tagsContainer}>
//                                 {activity.tags.map((tag, index) => (
//                                     <span key={index} className={styles.tag}>{tag}</span>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     <div className={styles.content}>
//                         {loading ? (
//                             <p className={styles.text}>טוען פרטי המשתמש...</p>
//                         ) : error ? (
//                             <p className={styles.text} style={{ color: 'red' }}>{error}</p>
//                         ) : recipient ? (
//                             <div className={styles.description}>
//                                 <h1 className={styles.reciverTitle}>המקבל:</h1>
//                                 <div className={styles.profileIcon}>
//                                     <CiUser className={styles.icon} />
//                                 </div>
//                                 <p className={styles.text}>{recipient.firstName} {recipient.lastName}</p>
//                                 <p className={styles.text}>{recipient.gender === "male" ? "בן" : "בת"} {calculateAge(recipient.dateOfBirth)}</p>
//                                 <p className={styles.text}>{recipient.address}</p>
//                                 <p className={styles.text}>דוא"ל: {recipient.email}</p>
//                                 <p className={styles.text}>טלפון: {recipient.phoneNumber}</p>
//                             </div>
//                         ) : (
//                             <p className={styles.text}>לא נמצאו פרטי משתמש.</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             {modeModel === 'open' && activityModalOpen()}
//             {modeModel.startsWith('success') && successModal()}
//             {modeModel === 'error' && errorModal()}
//         </>
//     );
// };

// export default ActivityModalForDonation;

'use client';

import { FaCheckCircle } from 'react-icons/fa';
import styles from "./ActivityModalForDonation.module.css";
import { Activity } from "@/types/activity";
import { User } from "@/types/user";
import { calculateAge } from "@/services/utils";
import { CiUser } from "react-icons/ci";
import { ErrorMessage, SuccessMessage } from '@/components';
import { useEffect, useState } from 'react';
import { getUserById } from '@/services/users';

interface ActivityModalForDonationProps {
    modeModel: string;
    onClose: () => void;
    activity: Activity;
}

const ActivityModalForDonation: React.FC<ActivityModalForDonationProps> = ({ modeModel, onClose, activity }) => {
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const userId = activity.receiverId || activity.giverId; // Check recipient first, fallback to giver
                if (userId) {
                    const user = await getUserById(userId as string); // Fetch user details
                    setUserDetails(user);
                } else {
                    setUserDetails(null);
                }
            } catch (err) {
                console.error("Failed to fetch user details:", err);
                setError("Failed to fetch user details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [activity.receiverId, activity.giverId]);

    const errorModal = () => (
        <ErrorMessage 
            message_line1="משהו השתבש... פעולתך נכשלה" 
            message_line2='תוכל לנסות שוב במועד מאוחר יותר' 
        />
    );

    const successModal = () => (
        <SuccessMessage
            message_line1="פרטי הפעילות נשלחו בהצלחה"
            message_line2="ניתן ליצור קשר עם המשתמש לפרטים נוספים"
        />
    );

    const activityModalOpen = () => (
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
                        {loading ? (
                            <p className={styles.text}>טוען פרטי המשתמש...</p>
                        ) : error ? (
                            <p className={styles.text} style={{ color: 'red' }}>{error}</p>
                        ) : userDetails ? (
                            <div className={styles.description}>
                                <h1 className={styles.reciverTitle}>
                                    {activity.receiverId ? 'המקבל:' : 'הנותן:'}
                                </h1>
                                <div className={styles.profileIcon}>
                                    <CiUser className={styles.icon} />
                                </div>
                                <p className={styles.text}>{userDetails.firstName} {userDetails.lastName}</p>
                                <p className={styles.text}>{userDetails.gender === "male" ? "בן" : "בת"} {calculateAge(userDetails.dateOfBirth)}</p>
                                <p className={styles.text}>{userDetails.address}</p>
                                <p className={styles.text}>דוא"ל: {userDetails.email}</p>
                                <p className={styles.text}>טלפון: {userDetails.phoneNumber}</p>
                            </div>
                        ) : (
                            <p className={styles.text}>לא נמצאו פרטי משתמש.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {modeModel === 'open' && activityModalOpen()}
            {modeModel.startsWith('success') && successModal()}
            {modeModel === 'error' && errorModal()}
        </>
    );
};

export default ActivityModalForDonation;
