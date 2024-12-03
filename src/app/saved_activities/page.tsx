'use client';
import styles from './savedActivities.module.css';
import { Activities, Loader, ActivityModal, ErrorMessage } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import useUserStore from '@/store/useUserStore';
import { useState } from 'react';
import { Activity } from '@/types/activity';

const SavedActivities = () => {
  const { user } = useUserStore();

  // Immediately return a static fallback if the user is not logged in
  if (!user) {
    <ErrorMessage message_line1="אתה לא מחובר!" message_line2='עליך להכנס לאתר/להרשם אם אין לך חשבון'/>
  }

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modeActivityModel, setModeActivityModel] = useState<string>('close');
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);

  // Always call hooks, even if you plan to render a fallback
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['savedActivities'],
    queryFn: () => getFilteringActivities('caughted', user._id),
    staleTime: 10000,
  });

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

  const handleAcceptActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(false)
    setModeActivityModel('success');
    updateStatusMutation.mutate({
      activityId: selectedActivity._id as string,
      status: 'accepted',
      receiverId: user._id,
    });
  };

  const handleCancellRequestActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(true)
    setModeActivityModel('success');
    updateStatusMutation.mutate({
      activityId: selectedActivity._id as string,
      status: 'proposed',
      receiverId: user._id,
    });
  };

  const closeModal = () => {
    setModeActivityModel('close');
  };

  // Render content based on the query's state
  if (isError) {
    return (
      <ErrorMessage message_line1="משהו השתבש..." message_line2='תוכל לנסות שוב במועד מאוחר יותר'/>
    )
  }

  return (
    <div className={styles.savedActivities}>
      <h1 className={styles.title}>הפעילויות השמורות שלי</h1>
      {(isLoading || isFetching) ? (
        <Loader />
      ) : (
        <Activities activities={data} onMoreDetails={handleMoreDetails} />
      )}
      {modeActivityModel !== 'close' && selectedActivity && (
        <ActivityModal
          isModeCancellig={isModeCancellig}
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          handlesMoreOptions={{
            handleAcceptActivity,
            handleCancellRequestActivity,
          }}
        />
      )}
    </div>
  );
};

export default SavedActivities;