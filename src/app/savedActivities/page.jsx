'use client';
import styles from './savedActivities.module.css';
import { Activities, Loader } from '@/components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCaughtActivities } from '@/services/activities';
import { useEffect } from 'react';


const SavedActivities = () => {
    const { isPending, error, activities, isLoading, isFetching }  
    = useQuery({ queryKey: ['savedActivities'], queryFn: getCaughtActivities('6742de4714108540e203ac55'), staleTime: 40000 });

    const useEffect = (console.log(activities), [activities])


    function handleMoreDetails() {
        return
    }
    
    function handleAcceptActivity() {
        return
    }
    
    function handleCancellRequestActivity() {
        return
    }


   return (
    <div>
        <h1 className={styles.title}>הפעילויות השמורות שלי</h1>
        {(isLoading || isPending) ? (
            <Loader/>
        ) : (
            <Activities activities={activities} 
                        handleMoreDetails={handleMoreDetails} 
                        handlesMoreOptions={{handleAcceptActivity: handleAcceptActivity,
                                             handleCancellRequestActivity: handleCancellRequestActivity
                        }}/>
        )}
    </div>
   )
}

export default SavedActivities;

