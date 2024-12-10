'use client';
import styles from './Activities.module.css';
import { Activity } from '@/types/activity';
import { ActivityCard } from '@/components';

interface ActivitiesProps {
    activities: Activity[];
    onMoreDetails: (activity: Activity) => void;
    onToggleFavorite?: (activityId: string, isFavorite: boolean) => void; // New prop
    isGeneral?: boolean;
    flag: boolean;
    handlesMoreOptions:  {
        onUpdate: () => void; 
        setSelectedActivity: any;
    } | null;
}


const Activities = ({ activities, onMoreDetails, flag, handlesMoreOptions, onToggleFavorite, isGeneral }: ActivitiesProps) => {
    return (
        <div className={styles.tableActivities}>
            {!activities || activities.length === 0 ? (
                <div className={styles.noActivities}>אין לך פעילויות שמורות...</div>
            ) : (
                activities.map((activity, index) => (
                    <ActivityCard
                        key={index}
                        activity={activity}
                        onMoreDetails={() => onMoreDetails(activity)}
                        onToggleFavorite={onToggleFavorite} // Pass down to ActivityCard
                        isGeneral={isGeneral}
                        flag={flag}
                        handlesMoreOptions={handlesMoreOptions}
                    />
                ))
            )}
        </div>
    );
};


export default Activities;
