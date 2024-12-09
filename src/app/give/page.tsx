'use client';

import styles from './give.module.css';
import { Activities, Loader, ErrorMessage, ActivityModal, MyDonation, ActivityPopUp } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getFilteringActivities } from '@/services/activities';
import useUserStore from '@/store/useUserStore';
import { useState /*, useEffect*/ } from 'react';
import { Activity } from '@/types/activity';


const give = () => {
  const { user } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem('LoggedIn') === 'true'
  );

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modeActivityModel, setModeActivityModel] = useState<string>('close');
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);

  const onUpdate = () => {
    setIsPopUpOpen(true); // Open the pop-up
  };

  const onClosePopUp = (): void => {
    setIsPopUpOpen(false); // Close the pop-up
  };

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['myDonatiom'],
    queryFn: () => getFilteringActivities('proposedGiver', user._id),
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
      <ErrorMessage message_line1="משהו השתבש..." message_line2='תוכל לנסות שוב במועד מאוחר יותר' />
    )
  }

  return (
    <div className={styles.savedActivities}>
      <MyDonation></MyDonation>
      {/* <ActivityPopUp activity={selectedActivity}></ActivityPopUp> */}
      <h1 className={styles.title}>מה אני תורם</h1>
      {(isLoading || isFetching) ? (
        <Loader />
      ) : (
        <Activities activities={data} onMoreDetails={handleMoreDetails} flag={true} handlesMoreOptions={{ onUpdate, setSelectedActivity }} />
      )}
      {modeActivityModel !== 'close' && selectedActivity && (
        <ActivityModal
          isModeCancellig={isModeCancellig}
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          handlesMoreOptions={{
          }}
        />
      )}
      {isPopUpOpen && (
        <div className={styles.popUpOverlay}>
          <div className={styles.popUpContent}>
            <button
              className={styles.closeButton}
              onClick={onClosePopUp}
            >
              ×
            </button>
            <ActivityPopUp activity={selectedActivity} closePopup={onClosePopUp} />
          </div>
        </div>
      )}
    </div>
  );
};

export default give;