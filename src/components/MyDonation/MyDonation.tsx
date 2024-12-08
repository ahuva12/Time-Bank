"use client";

import styles from "./myDonation.module.css";
import {
  Activities,
  Loader,
  ErrorMessage,
  ActivityModalForDonation,
} from "@/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFilteringActivities } from "@/services/activities";
import { useUserStore } from "@/store/useUserStore";
import { useState /*, useEffect*/ } from "react";
import { Activity } from "@/types/activity";

const myDonation = () => {
  const { user } = useUserStore();

  let isLoggedIn = false;
  if (typeof window !== "undefined") {
    isLoggedIn = !!localStorage.getItem("LoggedIn");
  } else { console.log("==4======= localStorage is not available in the server environment") }


  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [modeActivityModel, setModeActivityModel] = useState<string>("close");

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["myDonation"],
    queryFn: () => getFilteringActivities("caughtedGiver", user._id as string),
    staleTime: 10000,
    enabled: isLoggedIn,
  });

  // if (!isLoggedIn) {
  //   return (
  //     <ErrorMessage
  //       message_line1="אתה לא מחובר!"
  //       message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
  //     />
  //   );
  // }

  // Handlers
  const handleMoreDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel("open");
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
    <div>
      <h1 className={styles.title}>התרומה שלי</h1>
      <h3 className={styles.explain}>
        כאן תוכלו לעקוב אחר כל הפעילויות שהצעתם בתרומה ושאנשים כבר נרשמו אליהן,
        אך הן עדיין לא התקיימו.
      </h3>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Activities activities={data} onMoreDetails={handleMoreDetails} />
      )}
      {modeActivityModel !== "close" && selectedActivity && (
        <ActivityModalForDonation
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
        />
      )}
    </div>
  );
};

export default myDonation;
