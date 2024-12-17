'use client';
import styles from './Activities.module.css';
import { Activity } from '@/types/activity';
import { ActivityCard, ErrorMessage } from '@/components';

interface ActivitiesProps {
    activities: Activity[];
    onMoreDetails: (activity: Activity) => void;
    onToggleFavorite?: (activityId: string, isFavorite: boolean) => void; // New prop
    isGeneral?: boolean;
    flag: boolean;
    handlesMoreOptions:  {
        handleDeleteActivity?: (activityId:string) => void;
        onUpdate: () => void; 
        setSelectedActivity: any;
    } | null;
}


const Activities = ({ activities, onMoreDetails, flag, handlesMoreOptions, onToggleFavorite, isGeneral }: ActivitiesProps) => {
    if (!activities)
        return null

    return (
        <div className={styles.tableActivities}>
            {activities.length === 0 ? (
                // <div className={styles.noActivities}>
                //     אין לך פעילויות שמורות. רוצה גם אתה להרשם לפעילות בבנק הזמן?
                //     <a className={styles.link} href="#">לחץ כאן</a>
                //     על מנת לחפש פעילות להרשם אליה:)
                // </div>
                <h1 className={styles.noActivities}>
                    אין מידע רלוונטי להציג
                </h1>
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
