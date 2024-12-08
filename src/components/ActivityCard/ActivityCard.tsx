import React, { useState, useEffect } from "react";
import styles from "./ActivityCard.module.css";
import { Activity } from "@/types/activity";
import { FaStar, FaRegStar } from "react-icons/fa";

interface ActivityCardProps {
  activity: Activity;
  onMoreDetails: () => void;
  onToggleFavorite: (activityId: string, isFavorite: boolean) => void; // New prop
  isGeneral?: boolean;
}

const ActivityCard = ({ activity, onMoreDetails, onToggleFavorite, isGeneral }: ActivityCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(activity._id));
  }, [activity._id]);

  const toggleFavorite = () => {
    const activityId = activity._id as string;
    setIsFavorite((prev) => !prev);
    onToggleFavorite(activityId, isFavorite); // Notify the parent
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <p className={styles.name}>
            <strong>{activity.nameActivity}</strong>
          </p>
          {isGeneral && (
            isFavorite ? (
              <FaStar className={styles.icon} onClick={toggleFavorite} />
            ) : (
              <FaRegStar className={styles.icon} onClick={toggleFavorite} />
            )
          )}
        </div>
        <p>{activity.description}</p>
        <div className={styles.tags}>
          {activity.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
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
