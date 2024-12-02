'use client';
import styles from './savedActivities.module.css';
import { Activities, Loader } from '@/components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getFilteringActivities } from '@/services/activities';
import useUserStore from '@/store/useUserStore';

const SavedActivities = () => {
    const {user} = useUserStore();
    const { data, isPending, error, isLoading, isFetching } = useQuery({
        queryKey: ['savedActivities'],
        queryFn: () => getFilteringActivities('caughted', user._id),
        // queryFn: () => getFilteringActivities('caughted', '6745ce841396a6f699f26d13'),
        staleTime: 10000 
    })

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
       <div className={styles.savedActivities}>
           <h1 className={styles.title}>הפעילויות השמורות שלי</h1>
           {(isLoading || isPending) ? (
               <Loader />
           ) : (
               <Activities activities={data}/>
           )}
       </div>
   )
}


export default SavedActivities;
