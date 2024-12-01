import React from "react";
import styles from "./ActivityCard.module.css";
import { Activity } from "@/types/activity";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
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
      <a href="#" className={styles.link}>
        פרטים נוספים
      </a>
    </div>
  );
};
export default ActivityCard;
