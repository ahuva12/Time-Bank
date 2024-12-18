'use client';
import React, { useState, useEffect } from 'react';
import styles from './allActivities.module.css';
import { Activities, Loader, ActivityModal, ErrorMessage } from '@/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilteringActivities, updateStatusActivity } from '@/services/activities';
import { useUserStore } from '@/store/useUserStore';
import { Activity } from '@/types/activity';
import { useAuthStore } from '@/store/authStore';
import { registrationForActivity, RegistrationActivityPayload } from '@/services/registrationForActivity';
import { sendEmail } from '@/services/email/sendEmailClient';
import { User } from '@/types/user';
import { getUserById } from '@/services/users';

const AllActivities = () => {
  const { user, setUserField } = useUserStore();
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
  const [giverDetails, setGiverDetails] = useState<User | null>(null);

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

  const registerForActivityMutation = useMutation({
    mutationFn: registrationForActivity,
    onMutate: async ({
      activityId,
      giverId,
      receiverId,
      status,
    }: RegistrationActivityPayload) => {
      await queryClient.cancelQueries({ queryKey: ['allActivities'] });
  
      const previousSavedActivities = queryClient.getQueryData<Activity[]>(['allActivities']);
  
      queryClient.setQueryData<Activity[]>(
        ['allActivities'],
        (old) => (old ? old.filter((activity) => activity._id !== activityId) : [])
      );
      setModeActivityModel('success'); 
      if (user.remainingHours !== undefined && selectedActivity?.durationHours !== undefined) {
        setUserField('remainingHours', user.remainingHours - selectedActivity.durationHours); 
      } 
      return { previousSavedActivities };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousSavedActivities) {
        queryClient.setQueryData(['allActivities'], context.previousSavedActivities);
      }
      setModeActivityModel('error');
      if (user.remainingHours !== undefined && selectedActivity?.durationHours !== undefined) {
        setUserField('remainingHours', user.remainingHours + selectedActivity.durationHours); 
      } 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allActivities'] });
      sendEmailToGiverActivity();
    },
  });

  useEffect(() => {
    const fetchGievrActivityDetails = async () => {
      if(!selectedActivity) return;
      try {
          const giver = await getUserById(selectedActivity.giverId as string);
          setGiverDetails(giver);
  
      } catch (err) {
          console.error("Failed to fetch user details:", err);
      }
    };

    fetchGievrActivityDetails();
}, [selectedActivity]);

  const sendEmailToGiverActivity = async () => {
    if (!selectedActivity || !giverDetails) return;
    try {
      const bodySendEmail = {
        toEmail: giverDetails?.email as string,
        subjectEmail: `${user.firstName} ${user.lastName} נרשם לפעילות שלך!`,
        textEmail: `
        <div style="direction: rtl; text-align: right;">
          היי <strong>${giverDetails?.firstName}</strong>,<br /><br />
          אנחנו שמחים לעדכן אותך שהמשתמש <strong>${user.firstName} ${user.lastName}</strong> נרשם לפעילות שהצעת - <strong>${selectedActivity?.nameActivity}</strong>.<br /><br />
          העברנו לו את פרטי הקשר שלך והוא יצור איתך קשר בהקדם.<br /><br />
          יתרת השעות שלך עומדת על: <strong>${giverDetails?.remainingHours as number + selectedActivity?.durationHours}</strong><br />
        </div>
      `,
      };    
      await sendEmail(bodySendEmail); 
    } catch(error) {
      console.error(error)
    }
  }

  // Handlers
  const handleMoreDetails = async (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel('open');
  };

  const handleRegistrationActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(false);
    registerForActivityMutation.mutate({
      activityId: selectedActivity._id as string,
      giverId: selectedActivity.giverId as string,
      receiverId: user._id as string,
      status: 'caughted',
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

  //   if (!isLoggedIn && isInitialized) {
  //     return (
  //         <ErrorMessage
  //         message_line1="אתה לא מחובר!"
  //         message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
  //         link='/home'
  //         />
  //     );
  // }

  // Render content based on the query's state
  if (isError) {
    return (
      <ErrorMessage
        message_line1="אופס... משהו השתבש"
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
          <div className={styles.activities}>
            <Activities
              activities={filteredActivities}
              onMoreDetails={handleMoreDetails}
              onToggleFavorite={handleToggleFavorite}
              isGeneral={true}
              flag={false}
              handlesMoreOptions={null}
            />
          </div>
        </div>
      )}
      {modeActivityModel !== 'close' && selectedActivity && (
        <ActivityModal
          isModeCancellig={isModeCancellig}
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          giver_receiver_details={giverDetails as User}
          handlesMoreOptions={{
            handleRegistrationActivity,
          }}
        />
      )}
    </div>
  );
};

export default AllActivities;