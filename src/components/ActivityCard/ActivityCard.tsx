import React from "react";
import { useState /*, useEffect*/ } from 'react';
import styles from "./ActivityCard.module.css";
import { Activity } from "@/types/activity";
import { updateStatusActivity, updateActivity } from '@/services/activities';
import { ActivityPopUp } from '@/components'

interface ActivityCardProps {
  activity: Activity;
  onMoreDetails: () => void;
  flag: boolean;
  handlesMoreOptions:  {
    onUpdate: () => void; 
    setSelectedActivity: any
} | null;
}

const ActivityCard = ({ activity, onMoreDetails, flag, handlesMoreOptions }: ActivityCardProps) => {
  
  const onUpdate = (): void => {
    handlesMoreOptions?.setSelectedActivity(activity);
    handlesMoreOptions?.onUpdate();
  };

  const onDelete = async (): Promise<void> => {
    try {
      await updateStatusActivity({
        activityId: activity._id as string,
        status: 'cancelled',
        receiverId: null,
      });
      console.log("Activity deleted successfully!");
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div>
          <p className={styles.name}>
            <strong>{activity.nameActivity}</strong>
          </p>
          <p className={styles.hour}>
            {activity.durationHours} {"שעות"}
          </p>
        </div>
        <p>{activity.description}</p>
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
      {flag && (
        <div className={styles.buttonsContainer}>
          <button className={styles.moreOptionButton} onClick={onUpdate}>
            עדכון
          </button>
          <button className={styles.moreOptionButton} onClick={onDelete}>
            מחיקה
          </button>
        </div>
      )}
    </div>
  );
};
export default ActivityCard;
