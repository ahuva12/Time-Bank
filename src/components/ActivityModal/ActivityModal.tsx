"use client";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./ActivityModal.module.css";
import { Activity } from "@/types/activity";
import { User } from "@/types/user";
import { calculateAge } from "@/services/utils";
import { CiUser } from "react-icons/ci";
import { ErrorMessage, SuccessMessage, MiniLoader } from "@/components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
    if (modeModel === 'close') return null;

  const renderButtons = () => {
    const buttonConfig = [
      {
        handler: handlesMoreOptions.handleAcceptActivity,
        label: "קיבלתי",
        block: false,
      },
      {
        handler: handlesMoreOptions.handleCancellRequestActivity,
        label: "ביטול",
        block: false,
      },
      {
        handler: handlesMoreOptions.handleRegistrationActivity,
        label: "אני מעוניין בפעילות זו",
        block:
          !user?.remainingHours || user.remainingHours < activity.durationHours,
      },
      {
        handler: handlesMoreOptions.handleUpdateActivity,
        label: "עדכון",
        block: false,
      },
      {
        handler: handlesMoreOptions.handleCancellProposalActivity,
        label: "מחיקה",
        block: false,
      },
    ];

    return (
      <div className={styles.buttonsContainer}>
        {buttonConfig.map(
          (button, index) =>
            button.label &&
            button.handler && ( // תנאי נוסף - רק אם יש כיתוב
              <button
                key={index}
                className={`${styles.moreOptionButton} ${
                  button.block ? styles.disabledButton : ""
                }`}
                onClick={button.handler}
                disabled={button.block}
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
      <ErrorMessage
        message_line1="משהו השתבש... פעולתך נכשלה"
        message_line2="תוכל לנסות שוב במועד מאוחר יותר"
      />
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
      <div className={styles.popUpOverlay}>
        <div className={styles.container}>
          <div className={styles.closeButton} onClick={onClose}>
            &times;
          </div>
          <div className={styles.form}>
            <div className={styles.heading}>פרטי פעילות</div>
            <div className={styles.cardClient}>
              <div className={styles.formGroup}>
                <div className={styles.name}>{activity.nameActivity}</div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.actDetails}>{activity.description}</div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.actDetails}>
                  {activity.durationHours} שעות
                </div>
              </div>
              <div className={styles.tagsContainer}>
                {activity.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>      
            <div className={styles.cardClient}>
              {!isNeedUserDetails ? (
                <p>אף אחד עדיין לא בחר את הפעילות הזאת</p>
              ) : giver_receiver_details ? (
                <>
                  <div className={styles.logoContainer}>
                    {giver_receiver_details?.gender === "female" ? (
                      <DotLottieReact
                        className={styles.icon}
                        src="https://lottie.host/15aac7a1-b7b2-4340-b8f8-02eab363e880/ceE1Czg7gO.lottie"
                        loop
                        autoplay
                      />
                    ) : (
                      <DotLottieReact
                        className={styles.icon}
                        src="https://lottie.host/83af3d68-b7da-4527-bad5-ba99dc3455b2/Y1TNg89TDr.lottie"
                        loop
                        autoplay
                      />
                    )}
                  </div>
                  <p className={styles.name}>
                    {giver_receiver_details?.firstName} {giver_receiver_details?.lastName}
                    <span className={styles.userDet}>
                      {giver_receiver_details?.address}
                    </span>
                    <span className={styles.userDet}>
                      {giver_receiver_details?.phoneNumber}
                    </span>
                    <span className={styles.userDet}>{giver_receiver_details?.email}</span>
                  </p>
                </>
              ) : (
                <div className={styles.loader}>
                  <MiniLoader />
                  <div className={styles.loaderText}>טוען פרטי משתמש...</div>
                </div>
              )}
            </div>            
          </div>
          
          <div>{renderButtons()}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {modeModel === "open" && activityModalOpen()}
      {modeModel.startsWith("success") && successModal()}
      {modeModel === "error" && errorModal()}
    </>
  );
};

export default ActivityModal;
