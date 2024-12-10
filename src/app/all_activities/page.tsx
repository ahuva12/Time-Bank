'use client';
import React, { useState, useEffect } from 'react';
import styles from './allActivities.module.css';
import { Activities, Loader, ActivityModal, ErrorMessage } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import { useUserStore } from '@/store/useUserStore';
import { Activity } from '@/types/activity';
import { useAuthStore } from '@/store/authStore';

const AllActivities = () => {
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
  const [activeTab, setActiveTab] = useState('all'); // Default active tab
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const tabs = [
    { id: 'all', label: 'כל הפעילויות' },
    { id: 'liked', label: 'פעילויות שאהבת' },
  ];

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['allActivities'],
    queryFn: () => getFilteringActivities('proposed', user._id as string),
    staleTime: 10000,
    enabled: isLoggedIn,
  });

  // Fetch favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  // Filter activities based on active tab
  useEffect(() => {
    if (activeTab === 'liked' && data) {
      const likedActivities = data.filter((activity: Activity) =>
        favorites.includes(activity._id as string)
      );
      setFilteredActivities(likedActivities);
    } else if (activeTab === 'all') {
      setFilteredActivities(data || []);
    }
  }, [activeTab, data, favorites]);

    if (!isLoggedIn && isInitialized) {
        return (
            <ErrorMessage
            message_line1="אתה לא מחובר!"
            message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
            link='/home'
            />
        );
    }


  const updateStatusMutation = useMutation({
    mutationFn: updateStatusActivity,
    onMutate: async ({ activityId }: { activityId: string }) => {
      await queryClient.cancelQueries({ queryKey: ['allActivities'] });
      const previousSavedActivities = queryClient.getQueryData<Activity[]>(['allActivities']);
      queryClient.setQueryData<Activity[]>(
        ['allActivities'],
        (old) => (old ? old.filter((activity) => activity._id !== activityId) : [])
      );
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
    setIsModeCancellig(false);
    setModeActivityModel('success');
    updateStatusMutation.mutate({
      activityId: selectedActivity._id as string,
      status: 'caughted',
      receiverId: user._id as string,
    });
  };

  const handleToggleFavorite = (activityId: string, isFavorite: boolean) => {
    const updatedFavorites = isFavorite ?
      favorites.filter((id) => id !== activityId)
      : [...favorites, activityId];
    setFavorites(updatedFavorites);

    // Update localStorage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Update filteredActivities to remove the activity immediately if the tab is "liked"
    if (activeTab === "liked") {
      setFilteredActivities((prevActivities) =>
        prevActivities.filter((activity) => activity._id !== activityId)
      );
    }
  };


  const closeModal = () => {
    setModeActivityModel('close');
  };

  const SideBar = () => (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );

  // Render content based on the query's state
  if (isError) {
    return (
      <ErrorMessage
        message_line1="משהו השתבש..."
        message_line2="תוכל לנסות שוב במועד מאוחר יותר"
      />
    );
  }

  return (
    <div className={styles.savedActivities}>
      <h1 className={styles.title}>
        איזו פעילות אתה בוחר היום? יתרת השעות שלך היא: {user.remainingHours}
      </h1>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className={styles.activitiesContainer}>
          <SideBar />
          <Activities
            activities={filteredActivities}
            onMoreDetails={handleMoreDetails}
            onToggleFavorite={handleToggleFavorite}
            isGeneral={true}
            flag={false}
            handlesMoreOptions={null}
          />
        </div>
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

export default AllActivities;