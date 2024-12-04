'use client';

import styles from './myDonation.module.css';
import { Activities, Loader, ErrorMessage, ActivityModalForDonation } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import useUserStore from '@/store/useUserStore';
import { useState } from 'react';
import { Activity } from '@/types/activity';

const SavedActivities = () => {
    const { user } = useUserStore();

    // Check if user is logged in and render an error message if not
    if (!localStorage.getItem('LoggedIn') || localStorage.getItem('LoggedIn') === 'false') {
        return (
            <ErrorMessage
                message_line1="You are not logged in!"
                message_line2="You must log in/register if you do not have an account"
            />
        );
    }

    const queryClient = useQueryClient();
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [modeActivityModel, setModeActivityModel] = useState<string>('close');
    const [isModeCancelling, setIsModeCancelling] = useState<boolean>(false);

    // Fetch saved activities
    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ['savedActivities'],
        queryFn: () => getFilteringActivities('caught', user._id),
        staleTime: 10000,
    });

    // Mutation for updating activity status
    const updateStatusMutation = useMutation({
        mutationFn: updateStatusActivity,
        onMutate: async ({ activityId }: { activityId: string }) => {
            await queryClient.cancelQueries({ queryKey: ['savedActivities'] });
            const previousSavedActivities = queryClient.getQueryData<Activity[]>(['savedActivities']);
            queryClient.setQueryData<Activity[]>(['savedActivities'],
                (old) => old ? old.filter((activity) => activity._id !== activityId) : []);
            return { previousSavedActivities };
        },
        onError: (error, variables, context: any) => {
            if (context?.previousSavedActivities) {
                queryClient.setQueryData(['savedActivities'], context.previousSavedActivities);
            }
            setModeActivityModel('error');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedActivities'] });
        },
    });

    // Handlers
    const handleMoreDetails = (activity: Activity) => {
        setSelectedActivity(activity);
        setModeActivityModel('open');
    };

    const closeModal = () => {
        setModeActivityModel('close');
    };

    // Render content based on the query's state
    if (isError) {
        return (
            <ErrorMessage 
                message_line1="Something went wrong..." 
                message_line2="You can try again later" 
            />
        );
    }

    return (
        <div className={styles.savedActivities}>
            <h1 className={styles.title}>התרומות שלי</h1>
            {(isLoading || isFetching) ? (
                <Loader />
            ) : (
                <Activities activities={data} onMoreDetails={handleMoreDetails} />
            )}
            {modeActivityModel !== 'close' && selectedActivity && (
                <ActivityModalForDonation
                    modeModel={modeActivityModel}
                    onClose={closeModal}
                    activity={selectedActivity}
                />
            )}
        </div>
    );
};

export default SavedActivities;
