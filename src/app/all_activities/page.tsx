'use client';
import styles from './savedActivities.module.css';
import { Activities, Loader, ActivityModal, ErrorMessage } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import useUserStore from '@/store/useUserStore';
import { useState  } from 'react';
import { Activity } from '@/types/activity';

const SavedActivities = () => {
  const { user } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem('LoggedIn') === 'true'
  );

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modeActivityModel, setModeActivityModel] = useState<string>('close');
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['allActivities'],
    queryFn: () => getFilteringActivities('proposed', user._id),
    staleTime: 10000,
    enabled: isLoggedIn, 
  });

  if (!isLoggedIn) {
    return (
      <ErrorMessage
        message_line1="אתה לא מחובר!"
        message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
      />
    );
  }

  const updateStatusMutation = useMutation({
    mutationFn: updateStatusActivity,
    onMutate: async ({ activityId }: { activityId: string }) => {
      await queryClient.cancelQueries({ queryKey: ['allActivities'] });
      const previousSavedActivities = queryClient.getQueryData<Activity[]>(['allActivities']);
      queryClient.setQueryData<Activity[]>(['allActivities'], 
      (old) => old ? old.filter((activity) => activity._id !== activityId) : []);
      return { previousSavedActivities };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousSavedActivities) {
        queryClient.setQueryData(['allActivities'], context.previousSavedActivities);
      }  
      setModeActivityModel('error');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allActivities'] });
    },
  });
  
  // Handlers
  const handleMoreDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel('open');
  };

  const handleRegistrationActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(false)
    setModeActivityModel('success');
    updateStatusMutation.mutate({
      activityId: selectedActivity._id as string,
      status: 'caughted',
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
      <h1 className={styles.title}>איזו פעילות אתה בוחר היום? יתרת השעות שלך היא: {user.remainingHours}</h1>
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
            handleRegistrationActivity,
          }}
        />
      )}
    </div>
  );
};

export default SavedActivities;