'use client';
import styles from './savedActivities.module.css';
import { Activities, Loader, ActivityModal, ErrorMessage } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { registrationForActivity, RegistrationActivityPayload } from '@/services/registrationForActivity';

const SavedActivities = () => {
  const { user } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
      setIsInitialized(true); 
  }, [isLoggedIn]);

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modeActivityModel, setModeActivityModel] = useState<string>('close');
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['savedActivities'],
    queryFn: () => getFilteringActivities('caughted', user._id as string),
    staleTime: 10000,
    enabled: isLoggedIn, 
  });

  const acceptActivityMutation = useMutation({
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

  const unregisterForActivityMutation = useMutation({
    mutationFn: registrationForActivity,
    onMutate: async ({
      activityId,
      giverId,
      receiverId,
      status,
    }: RegistrationActivityPayload) => {
      await queryClient.cancelQueries({ queryKey: ['savedActivities'] }); 
      const previousSavedActivities = queryClient.getQueryData<Activity[]>(['savedActivities']);
      queryClient.setQueryData<Activity[]>(
        ['savedActivities'],
        (old) => (old ? old.filter((activity) => activity._id !== activityId) : [])
      );  
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
    acceptActivityMutation.mutate({
      activityId: selectedActivity._id as string,
      status: 'accepted',
      receiverId: user._id as string,
    });
  };

  const handleCancellRequestActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(true)
    setModeActivityModel('success');
    unregisterForActivityMutation.mutate({
      activityId: selectedActivity._id as string,
      giverId: selectedActivity.giverId as string,
      receiverId: user._id as string,
      status: 'proposed',
    });  
  };

  const closeModal = () => {
    setModeActivityModel('close');
  };

  if (!isLoggedIn && isInitialized) {
    return (
      <ErrorMessage
        message_line1="אתה לא מחובר!"
        message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
        link='/home'
      />
    );
  }

  // Render content based on the query's state
  if (isError) {
    return (
      <ErrorMessage message_line1="אופס... משהו השתבש" message_line2='תוכל לנסות שוב במועד מאוחר יותר'/>
    )
  }

  return (
    <div className={styles.savedActivities}>
      <h1 className={styles.title}>הפעילויות השמורות שלי</h1>
      <h3 className={styles.explain}>
      כאן תוכלו לראות את כל הפעילויות שאליהן נרשמתם אך עדיין לא השתתפתם בהן בפועל.      </h3>
      {(isLoading || isFetching) ? (
        <Loader />
      ) : (
        <Activities activities={data} onMoreDetails={handleMoreDetails} flag={false} handlesMoreOptions={null}/>
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