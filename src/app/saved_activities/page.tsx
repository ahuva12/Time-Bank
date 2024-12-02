'use client';
import styles from './savedActivities.module.css';
import { Activities, Loader, ActivityModal } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import useUserStore from '@/store/useUserStore';
import { useState } from 'react';
import { Activity } from '@/types/activity';

const SavedActivities = () => {
  const { user } = useUserStore();

  // Immediately return a static fallback if the user is not logged in
  if (!user) {
    return <div>Please log in to view your saved activities.</div>;
  }

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modeActivityModel, setModeActivityModel] = useState<string>('close');

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
      const previousSavedActivities = queryClient.getQueryData(['savedActivities']);
      queryClient.setQueryData(['savedActivities'], (old: Activity[]) => old.filter((activity: Activity) => activity._id !== activityId));
      return { previousSavedActivities };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedActivities'] });
      setModeActivityModel('success');
    },
    onError: (error: any, context: any) => {
      queryClient.setQueryData(['savedActivities'], context.previousSavedActivities);
      console.error('Error updating activity:', error);
      setModeActivityModel('error');
    },
  });

  // Handlers
  const handleMoreDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel('open');
  };

  const handleAcceptActivity = () => {
    if (!selectedActivity) return;
    updateStatusMutation.mutate({
      activityId: selectedActivity._id as string,
      status: 'accepted',
      receiverId: user._id,
    });
  };

  const handleCancellRequestActivity = () => {
    if (!selectedActivity) return;
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
    return <div>Something went wrong while fetching activities.</div>;
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
