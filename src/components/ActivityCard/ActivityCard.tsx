import React from "react";
import styles from "./ActivityCard.module.css";
import { Activity } from "@/types/activity";

interface ActivityCardProps {
  activity: Activity;
  onMoreDetails: () => void;
}

const ActivityCard = ({ activity, onMoreDetails }: ActivityCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <p className={styles.name}>
          <strong>{activity.nameActivity}</strong>
        </p>
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
    </div>
  );
};
export default ActivityCard;
