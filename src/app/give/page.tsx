"use client";

import styles from "./give.module.css";
import {
  Activities,
  Loader,
  ErrorMessage,
  ActivityModal,
  MyDonation,
} from "@/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFilteringActivities,
  updateStatusActivity,
} from "@/services/activities";
import useUserStore from "@/store/useUserStore";
import { useState /*, useEffect*/ } from "react";
import { Activity } from "@/types/activity";

const give = () => {
  const { user } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("LoggedIn") === "true"
  );

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [modeActivityModel, setModeActivityModel] = useState<string>("close");
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["myDonatiom"],
    queryFn: () => getFilteringActivities("proposedGiver", user._id),
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
  //mutationFn: updateActivity

  const updateStatusMutation = useMutation({
    mutationFn: updateStatusActivity,
    onMutate: async ({ activityId }: { activityId: string }) => {
      await queryClient.cancelQueries({ queryKey: ["give"] });
      const previousGive = queryClient.getQueryData<Activity[]>(["give"]);
      queryClient.setQueryData<Activity[]>(["give"], (old) =>
        old ? old.filter((activity) => activity._id !== activityId) : []
      );
      return { previousGive };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousGive) {
        queryClient.setQueryData(["give"], context.previousGive);
      }
      setModeActivityModel("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["give"] });
    },
  });

  // Handlers
  const handleMoreDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel("open");
  };

  const handleCancellProposalActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(false);
    setModeActivityModel("success");
    updateStatusMutation.mutate({
      activityId: selectedActivity._id as string,
      status: "cancelled",
      receiverId: null,
    });
  };

  const handleUpdateActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(false);
    setModeActivityModel("success");

    //TO DO: open popup that takes the new updates and add it to new Activity
    // updateActivityMutation.mutate({
    //   activityId: selectedActivity._id as string,
    //   status: 'proposed',
    //   receiverId: selectedActivity.receiverId as string,
    //   nameActivity: string;
    //   durationHours: number;
    //  description: string;
    //  tags: Array<string> | [];
    // } as Activity);
  };

  const closeModal = () => {
    setModeActivityModel("close");
  };

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
      <MyDonation></MyDonation>
      <h1 className={styles.title}>מה אני תורם</h1>
      <h3 className={styles.explain}>
        בעמוד זה מופיעות כל הפעילויות שהצעתם בתרומה ושעדיין לא נרשמו להן
        משתתפים. תוכלו לעדכן, לשפר או לקדם את הפעילויות.
      </h3>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Activities activities={data} onMoreDetails={handleMoreDetails} />
      )}
      {modeActivityModel !== "close" && selectedActivity && (
        <ActivityModal
          isModeCancellig={isModeCancellig}
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          handlesMoreOptions={{
            handleCancellProposalActivity,
            handleUpdateActivity,
          }}
        />
      )}
    </div>
  );
};

export default give;
