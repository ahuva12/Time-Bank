"use client";
import styles from "./give.module.css";
import {
  Activities,
  Loader,
  ErrorMessage,
  SuccessMessage,
  ActivityModal,
  MyDonation,
  ActivityForm,
} from "@/components";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getFilteringActivities, updateActivity , updateStatusActivity, postActivity} from "@/services/activities";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from "react";
import { Activity } from "@/types/activity";
import { FaPlus } from "react-icons/fa";

const give = () => {

  const { user } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, [isLoggedIn]);

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modeActivityModel, setModeActivityModel] = useState<string>("close");
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);
  const [isSuccessMessageAdding, setIsSuccessMessageAdding] = useState<boolean>(false);
  const [isSuccessMessageUpdating, setIsSuccessMessageUpdating] = useState<boolean>(false);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["myDonation_Proposed"],
    queryFn: () => getFilteringActivities("proposedGiver", user._id as string),
    staleTime: 10000,
    enabled: isLoggedIn,
  });

  //Mutations
  const updateActivityMutation = useMutation({
    mutationFn: updateActivity,
    onMutate: async (activity:Activity) => {
      await queryClient.cancelQueries({ queryKey: ['myDonation_Proposed'] });
      const previousActivities = queryClient.getQueryData<Activity[]>(['myDonation_Proposed']);
      queryClient.setQueryData<Activity[]>(['savedActivities'], 
        (old) => 
          old ? old.map((act) => act._id === activity._id ? { ...act, ...activity } : act) : []);
        setIsSuccessMessageUpdating(true); 
        return { previousActivities };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['myDonation_Proposed'], context.previousActivities);
      }  
      setIsSuccessMessageUpdating(false); 
      setIsErrorMessage(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDonation_Proposed'] });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: updateStatusActivity,
    onMutate: async ({
      activityId,
      status,
      receiverId,
    }: {activityId:string, status: string, receiverId: string|null}) => {
      await queryClient.cancelQueries({ queryKey: ['myDonation_Proposed'] }); 
      const previousActivities = queryClient.getQueryData<Activity[]>(['myDonation_Proposed']);
      queryClient.setQueryData<Activity[]>(
        ['myDonation_Proposed'],
        (old) => (old ? old.filter((activity) => activity._id !== activityId) : [])
      ); 
      return { previousActivities };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['myDonation_Proposed'], context.previousActivities);
      }
      setIsErrorMessage(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDonation_Proposed'] });
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: postActivity,
    onMutate: async (newActivity:Activity) => {
      await queryClient.cancelQueries({ queryKey: ['myDonation_Proposed'] }); 
      const previousActivities = queryClient.getQueryData<Activity[]>(['myDonation_Proposed']);
      queryClient.setQueryData<Activity[]>(
        ['myDonation_Proposed'],
        (old) => (old ? [...old, newActivity] : [newActivity])
      );
      setIsSuccessMessageAdding(true); 
      return { previousActivities };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['myDonation_Proposed'], context.previousActivities);
      }
      setIsSuccessMessageAdding(false); 
      setIsErrorMessage(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDonation_Proposed'] });
    },
  });

  const onAddActivity = () => {
    setSelectedActivity(null);
    setIsAddingActivity(true);
    setIsPopUpOpen(true);
  };

  const onUpdate = () => {
    setIsAddingActivity(false); 
    setIsPopUpOpen(true); 
  };

  const onClosePopUp = (): void => {
    setIsPopUpOpen(false); 
  };

  // Handlers
  const handleUpdateActivity = (updatedActivity:Activity) : void => {
    updateActivityMutation.mutate(updatedActivity) 
    setIsSuccessMessageUpdating(false); 
    setIsErrorMessage(false);
  };

  const handleAddActivity = (newActivity:Activity) : void => {
    addActivityMutation.mutate(newActivity);  
    setIsSuccessMessageAdding(false); 
    setIsErrorMessage(false);
  };

  const handleDeleteActivity = (activityId:string) : void => {
    deleteActivityMutation.mutate({
      activityId,
      status: 'cancelled',
      receiverId: null,
    });  
    setIsErrorMessage(false);
  };

  const handleMoreDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel("open");
  };

  const closeModal = () => {
    setModeActivityModel("close");
  };

  // if (!isLoggedIn && isInitialized) {
  //   return (
  //     <ErrorMessage
  //       message_line1="אתה לא מחובר!"
  //       message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
  //       link='/home'
  //     />
  //   );
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
      <div className={styles.headerCom}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>מה אני תורם</h1>
          <h3 className={styles.explain}>
            כאן תוכלו לעקוב ולערוך את כל הפעילויות שהצעתם בתרומה ושאנשים עוד לא
            נרשמו אליהן.
          </h3>
        </div>
        <button className={styles.addBtn} onClick={onAddActivity}>
          <div className={styles.btnText}>הוספת פעילות חדשה</div>
          <div className={styles.plusSign}>
            {" "}
            <FaPlus />
          </div>
        </button>
      </div>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Activities
          activities={data}
          onMoreDetails={handleMoreDetails}
          flag={true}
          handlesMoreOptions={{ onUpdate, setSelectedActivity, handleDeleteActivity }}
        />
      )}
      {modeActivityModel !== "close" && selectedActivity && (
        <ActivityModal
          isModeCancellig={isModeCancellig}
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          handlesMoreOptions={{}}
        />
      )}
      <MyDonation></MyDonation>
      {isPopUpOpen && (
        <div className={styles.popUpOverlay}>
          <div className={styles.popUpContent}>
            <button className={styles.closeButton} onClick={onClosePopUp}>
              ×
            </button>
            {/* <ActivityPopUp activity={selectedActivity} closePopup={onClosePopUp} /> */}
            <ActivityForm
              activity={isAddingActivity ? {} : selectedActivity} // Pass empty object for new activity
              closePopup={onClosePopUp}
              handleAddActivity={handleAddActivity}
              handleUpdateActivity={handleUpdateActivity}
              isNew={isAddingActivity} // Pass "isNew" prop to indicate mode
            />
          </div>
        </div>
      )}
      {isSuccessMessageAdding && (
        <SuccessMessage
        message_line1="איזה כיף! הפעילות שלך נוספה בהצלחה"
        message_line2="נעדכן אותך כשמישהו ירשם אליה"
        />      
      )}
      {isSuccessMessageUpdating && (
        <SuccessMessage
        message_line1="פרטי הפעילות שלך עודכנו בהצלחה:)"
        message_line2="נעדכן אותך כשמישהו ירשם אליה"
        />      
      )}
      {isErrorMessage && (
       <ErrorMessage
               message_line1="אופס... משהו השתבש"
               message_line2="תוכל לנסות שוב במועד מאוחר יותר"
        />   
      )}
    </div>
  );
};

export default give;
