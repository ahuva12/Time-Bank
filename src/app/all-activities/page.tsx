"use client";
import React, { useState, useEffect } from "react";
import styles from "./allActivities.module.css";
import { Activities, Loader, ActivityModal, ErrorMessage } from "@/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFilteringActivities,
  updateStatusActivity,
} from "@/services/activities";
import { useUserStore } from "@/store/useUserStore";
import { Activity } from "@/types/activity";
import { useAuthStore } from "@/store/authStore";
import {
  registrationForActivity,
  RegistrationActivityPayload,
} from "@/services/registrationForActivity";
import { sendEmail } from "@/services/email/sendEmailClient";
import { User } from "@/types/user";
import { getUserById } from "@/services/users";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const AllActivities = () => {
  const { user, setUserField } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, [isLoggedIn]);

  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [modeActivityModel, setModeActivityModel] = useState<string>("close");
  const [isModeCancellig, setIsModeCancellig] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("all"); // Default active tab
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [giverDetails, setGiverDetails] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [isFilterPopup, setIsFilterPopup] = useState(false);

  const tabs = [
    { id: "all", label: "כל הפעילויות" },
    { id: "liked", label: "פעילויות שאהבת" },
  ];

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["allActivities"],
    queryFn: () => getFilteringActivities("proposed", user._id as string),
    staleTime: 10000,
    enabled: isLoggedIn,
  });

  // Fetch favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  // Filter activities based on active tab
  useEffect(() => {
    if (activeTab === "liked" && data) {
      const likedActivities = data.filter((activity: Activity) =>
        favorites.includes(activity._id as string)
      );
      setFilteredActivities(likedActivities);
    } else if (activeTab === "all") {
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
      await queryClient.cancelQueries({ queryKey: ["allActivities"] });

      const previousSavedActivities = queryClient.getQueryData<Activity[]>([
        "allActivities",
      ]);

      queryClient.setQueryData<Activity[]>(["allActivities"], (old) =>
        old ? old.filter((activity) => activity._id !== activityId) : []
      );
      setModeActivityModel("success");
      if (
        user.remainingHours !== undefined &&
        selectedActivity?.durationHours !== undefined
      ) {
        setUserField(
          "remainingHours",
          user.remainingHours - selectedActivity.durationHours
        );
      }
      return { previousSavedActivities };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousSavedActivities) {
        queryClient.setQueryData(
          ["allActivities"],
          context.previousSavedActivities
        );
      }
      setModeActivityModel("error");
      if (
        user.remainingHours !== undefined &&
        selectedActivity?.durationHours !== undefined
      ) {
        setUserField(
          "remainingHours",
          user.remainingHours + selectedActivity.durationHours
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allActivities"] });
      sendEmailToGiverActivity();
    },
  });

  useEffect(() => {
    const fetchGievrActivityDetails = async () => {
      if (!selectedActivity) return;
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
          אנחנו שמחים לעדכן אותך שהמשתמש <strong>${user.firstName} ${user.lastName
          }</strong> נרשם לפעילות שהצעת - <strong>${selectedActivity?.nameActivity
          }</strong>.<br /><br />
          העברנו לו את פרטי הקשר שלך והוא יצור איתך קשר בהקדם.<br /><br />
          יתרת השעות שלך עומדת על: <strong>${(giverDetails?.remainingHours as number) +
          selectedActivity?.durationHours
          }</strong><br />
        </div>
      `,
      };
      await sendEmail(bodySendEmail);
    } catch (error) {
      console.error(error);
    }
  };

  // Handlers
  const handleMoreDetails = async (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel("open");
  };

  const handleRegistrationActivity = () => {
    if (!selectedActivity) return;
    setIsModeCancellig(false);
    registerForActivityMutation.mutate({
      activityId: selectedActivity._id as string,
      giverId: selectedActivity.giverId as string,
      receiverId: user._id as string,
      status: "caughted",
    });
  };

  const handleToggleFavorite = (activityId: string, isFavorite: boolean) => {
    const updatedFavorites = isFavorite
      ? favorites.filter((id) => id !== activityId)
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

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log(value);
    if (value.trim() === "") {
      // If the search query is empty, show all data
      setFilteredActivities(data);
    } else {
      // Filter the data based on the search query
      const filtered = data.filter((item: Activity) =>
        item.nameActivity.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  };

  const handleTagSearch = (tag: string) => {
    setSearchTags((prevTags) => {
      if (prevTags.includes(tag)) {
        // Remove the tag if it's already selected
        const newTags = prevTags.filter((t) => t !== tag);
        updateFilteredActivities(newTags);
        return newTags;
      } else {
        // Add the tag if it's not selected
        const newTags = [...prevTags, tag];
        updateFilteredActivities(newTags);
        return newTags;
      }
    });
  };

  // Helper function to update activities based on tags
  const updateFilteredActivities = (tags: string[]) => {
    if (tags.length === 0) {
      setFilteredActivities(data);
    } else {
      const filtered = data.filter((item: Activity) =>
        item.tags.some((t) => tags.includes(t))
      );
      setFilteredActivities(filtered);
    }
  };

  const clearSelectedTags = () => {
    setSearchTags([]);
    setFilteredActivities(data);
  };

  const closeModal = () => {
    setModeActivityModel("close");
  };

  const SideBar = () => {
    const [showAllTags, setShowAllTags] = useState(false);
    const [visibleTags, setVisibleTags] = useState(showAllTags
      ? activityTags // אם מוצגות כל התגיות
      : activityTags.slice(0, 5)); // אחרת מוצגות רק חצי מהן

    const toggleTags = () => {
      setShowAllTags((prevState) => !prevState); // שינוי המצב של התצוגה
      setVisibleTags(!showAllTags
        ? activityTags // אם מוצגות כל התגיות
        : activityTags.slice(0, 5)); 
    };

    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""
                }`}
              onClick={() => {
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              padding: "10px",
            }}
          >
            <div
              className={`${styles.tag} ${styles.clearTags}`}
              onClick={clearSelectedTags}
            >
              ניקוי
            </div>
            {visibleTags
              .sort((a, b) => a.localeCompare(b, "he"))
              .map((tag, index) => (
                <div
                  key={index}
                  className={`${styles.tag} ${searchTags.includes(tag) ? styles.activeTag : ""
                    }`}
                  onClick={() => {
                    handleTagSearch(tag);
                    setShowAllTags(true);
                  }}
                >
                  {tag}
                </div>
              ))}
          </div>
          <div
            className={styles.toggleTags}
            onClick={toggleTags}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center", // מרכז את החץ
              alignItems: "center",
              padding: "10px", // רווח מסביב לחץ
            }}
          >
            {showAllTags ? (
              <DotLottieReact
                src="https://lottie.host/274b2edb-6f38-420e-a3af-33e7e238c7fa/ejTzudBuMX.lottie"
                loop
                autoplay
                style={{
                  width: "30px",
                  height: "30px",
                  transform: "rotate(180deg)", // הופך את האנימציה
                  transition: "transform 0.3s", // מוסיף מעבר חלק אם תרצי לשנות כיוון
                }}
              />
            ) : (
              <DotLottieReact
                src="https://lottie.host/274b2edb-6f38-420e-a3af-33e7e238c7fa/ejTzudBuMX.lottie"
                loop
                autoplay
                style={{
                  width: "30px",
                  height: "30px",
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };



  if (!isLoggedIn && isInitialized) {
    return (
      <ErrorMessage
        message_line1="אתה לא מחובר!"
        message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
        link="/home"
      />
    );
  }

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
      <div className={styles.title}>
        <input
          className={`${styles.input} ${styles.tab}`}
          type="text"
          placeholder="חיפוש חופשי"
          value={searchQuery}
          onChange={handleTitleSearch}
        />
      </div>
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
      {modeActivityModel !== "close" && selectedActivity && (
        <ActivityModal
          isModeCancellig={isModeCancellig}
          modeModel={modeActivityModel}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          giver_receiver_details={giverDetails as User}
          isNeedUserDetails={true}
          handlesMoreOptions={{
            handleRegistrationActivity,
          }}
        />
      )}
    </div>
  );
};

const activityTags = [
  "ספורט",
  "טיול",
  "אומנות",
  "מוזיקה",
  "בישול",
  "קריאה",
  "ריקוד",
  "משחקים",
  "גינון",
  "צילום",
  "עבודות יד",
  "התנדבות",
  "בייביסיטר",
  "לימודים",
  "כושר",
  "טכנולוגיה",
  "מחשבים",
  "עיצוב",
  "שחייה",
  "אופנה",
  "נסיעות",
  "תיקון",
  "טיפוח",
  "בריאות",
  "לימודי שפה",
  "שיעור פרטי",
  "שפות",
  "טכנאי",
  "ילדים",
  "מבוגרים",
];

export default AllActivities;
