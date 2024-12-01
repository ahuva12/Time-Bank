'use client';
import styles from './Activities.module.css';
import { Activity } from '@/types/activity';
import { ActivityCardBtn, Loader } from '@/components';
import { useEffect } from 'react';

interface ActivitiesProps {
    activities: Activity[];
    handleMoreDetails: () => void;
    handlesMoreOptions: {
        handleAcceptActivity?: () => void;
        handleCancellRequestActivity?: () => void;
        handleRequesterDetails?: () => void;
        handleUpdateActivity?: () => void;
        handleCancellProposalActivity?: () => void;
    };

  }
  

const Activities = ({activities, handleMoreDetails, handlesMoreOptions}: ActivitiesProps) => {

  const useEffect = (console.log(activities), [activities])

   return (<div>
    {activities ? ( <div className={styles.tableActivities}> 
        {activities.map((activity, index) => (<ActivityCardBtn 
                                                key={index}
                                                activity={activity}
                                                handleMoreDetails={handleMoreDetails}
                                                handlesMoreOptions={handlesMoreOptions}/>))}
   </div>) : (<Loader/>)}
   
        
    </div>
   )
}

export default Activities;

