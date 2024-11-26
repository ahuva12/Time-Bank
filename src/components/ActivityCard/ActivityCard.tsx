'use client';
import styles from './ActivityCard.module.css';
import React from 'react';
import { Activity } from '@/types/activity';

interface ActivityCardProps {
    activity: Activity;
    handleMoreDetails?: () => void;
    handlesMoreOptions?: {
        handleAcceptActivity?: () => void;
        handleCancellRequestActivity?: () => void;
        handleRequesterDetails?: () => void;
        handleUpdateActivity?: () => void;
        handleCancellProposalActivity?: () => void;
    };
}

const ActivityCard = ({ activity, handleMoreDetails, handlesMoreOptions }: ActivityCardProps) => {
    const renderButtons = () => {
        if (!handlesMoreOptions) return null;

        const buttonConfig = [
            { handler: handlesMoreOptions.handleAcceptActivity, label: 'קיבלתי' },
            { handler: handlesMoreOptions.handleCancellRequestActivity, label: 'ביטול' },
            { handler: handlesMoreOptions.handleRequesterDetails, label: 'פרטי המבקש' },
            { handler: handlesMoreOptions.handleUpdateActivity, label: 'עדכון' },
            { handler: handlesMoreOptions.handleCancellProposalActivity, label: 'מחיקה' },
        ];

        return buttonConfig.map(
            (button, index) =>
                button.handler && (
                    <button
                        key={index}
                        className={styles.moreOptionButton}
                        onClick={button.handler}
                    >
                        {button.label}
                    </button>
                )
        );
    };

    return (
        <div className={styles.ActivityCard}>
            <div className={styles.ActivityCardHalf1}>
                <p className={styles.nameActivity}>
                    {activity.nameActivity}
                </p>
                <p className={styles.description}>
                    {activity.description}
                </p>
                <p className={styles.tags}>
                    {activity.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </p>
                {handleMoreDetails && (
                    <button className={styles.moreDetails} onClick={handleMoreDetails}>
                        פרטים נוספים
                    </button>
                )}
            </div>
           
            {handlesMoreOptions && 
                <div className={styles.limit}></div>
            }
            {handlesMoreOptions && 
            <div className={styles.ActivityCardHalf2}>
                {renderButtons()}</div>
            }
        </div>
    );
};

export default ActivityCard;
