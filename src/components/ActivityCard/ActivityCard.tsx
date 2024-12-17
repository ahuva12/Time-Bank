
import React, { useState, useEffect } from "react";
import styles from "./ActivityCard.module.css";
import { Activity } from "@/types/activity";
import { FaStar, FaRegStar } from "react-icons/fa";
import { updateStatusActivity } from '@/services/activities';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { WarningMessage } from '@/components';

interface ActivityCardProps {
  activity: Activity;
  onMoreDetails: () => void;
  onToggleFavorite?: (activityId: string, isFavorite: boolean) => void;
  isGeneral?: boolean;
  flag: boolean;
  handlesMoreOptions: null | {
    handleDeleteActivity?: (activityId:string) => void;
    onUpdate: () => void;
    setSelectedActivity: any
  };
}

const ActivityCard = ({ activity, onMoreDetails, flag, handlesMoreOptions, onToggleFavorite, isGeneral }: ActivityCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isWarningMessage, setIsWarningMessage] = useState<boolean>(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(activity._id));
  }, [activity._id]);

  const toggleFavorite = () => {
    const activityId = activity._id as string;
    setIsFavorite((prev) => !prev);
    if (onToggleFavorite !== undefined)
      onToggleFavorite(activityId, isFavorite); // Notify the parent
  }

  const onUpdate = (): void => {
    handlesMoreOptions?.setSelectedActivity(activity);
    handlesMoreOptions?.onUpdate();
  };

  // const deleteActivity = async (): Promise<void> => {
  //   try {
  //     console.log({
  //       activityId: activity._id as string,
  //       status: 'cancelled',
  //       receiverId: null,
  //     })
  //     await updateStatusActivity({
  //       activityId: activity._id as string,
  //       status: 'cancelled',
  //       receiverId: null,
  //     });
  //     console.log("Activity deleted successfully!");
  //     setIsWarningMessage(false)

  //   } catch (error) {
  //     console.error("Error deleting activity:", error);
  //   }
  // };

  const deleteActivity = async (): Promise<void> => {
    try {
      if (handlesMoreOptions?.handleDeleteActivity) {
        handlesMoreOptions.handleDeleteActivity(activity?._id as string);
        console.log("Activity deleted successfully!");
      } else {
        console.error("Delete handler is not provided.");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setIsWarningMessage(false);
    }
  };
  


  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.innerConatainer}>
          <div>
            <p className={styles.name}>
              <strong>{activity.nameActivity}</strong>
            </p>
            <p className={styles.hour}>
              {activity.durationHours} {"שעות"}
            </p>
          </div>
          {isGeneral && (
            isFavorite ? (
              <FaStar className={styles.icon} onClick={toggleFavorite} />
            ) : (
              <FaRegStar className={styles.icon} onClick={toggleFavorite} />
            )
          )}
          {flag && (
            <div className={styles.icons}>
              <FaEdit className={styles.editIcon} onClick={onUpdate} />
              <FaTrash className={styles.editIcon} onClick={() => setIsWarningMessage(true)} />
            </div>
          )}
        </div>
        <p className={styles.description}>{activity.description}</p>
        <div className={styles.tags}>
          {activity.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button className={styles.link} onClick={onMoreDetails}>
        פרטים נוספים
      </button>
      {flag && isWarningMessage && (
        <WarningMessage message="אתה בטוח שברצונך למחוק את הפעילות?" 
                        okfunction={deleteActivity} 
                        setIsWarningMessage={setIsWarningMessage}/> 
      )}

    </div>
  );
};


export default ActivityCard;
