'use client';
import styles from './ActivityCardBtn.module.css';
import React from 'react';
import { Activity } from '@/types/activity';

interface ActivityCardBtnProps {
    activity: Activity;
    handleMoreDetails: () => void;
    handlesMoreOptions: {
        handleAcceptActivity?: () => void;
        handleCancellRequestActivity?: () => void;
        handleRequesterDetails?: () => void;
        handleUpdateActivity?: () => void;
        handleCancellProposalActivity?: () => void;
    };
}

const ActivityCardBtn = ({ activity, handleMoreDetails, handlesMoreOptions }: ActivityCardBtnProps) => {
    const renderButtons = () => {

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
                <button className={styles.moreDetails} onClick={handleMoreDetails}>
                    פרטים נוספים
                </button>
            </div>
            
            <div className={styles.limit}></div>

            <div className={styles.ActivityCardHalf2}>
                    {renderButtons()}
            </div>
        </div>
    );
};

export default ActivityCardBtn;

