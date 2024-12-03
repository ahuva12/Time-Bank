'use client';
import styles from './Activities.module.css';
import { Activity } from '@/types/activity';
import { ActivityCard } from '@/components';

interface ActivitiesProps {
    activities: Activity[];
    onMoreDetails: (activity: Activity) => void;
}

const Activities = ({ activities, onMoreDetails }: ActivitiesProps) => {
    return (
        <div className={styles.tableActivities}>
            {activities.length === 0 ? (
                <div className={styles.noActivities}>
                    אין לך פעילויות שמורות. רוצה גם אתה להרשם לפעילות בבנק הזמן?
                    <a className={styles.link} href="#">לחץ כאן</a>
                    על מנת לחפש פעילות להרשם אליה:)
                </div>
            ) : (
                activities.map((activity, index) => (
                    <ActivityCard
                        key={index}
                        activity={activity}
                        onMoreDetails={() => onMoreDetails(activity)}
                    />
                ))
            )}
        </div>
    );
};

export default Activities;
