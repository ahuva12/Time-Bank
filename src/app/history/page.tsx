"use client";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import useUserStore from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Activity } from "@/types/activity";
import { getFilteringActivities } from "@/services/activities";
import styles from "./history.module.css";
import { ActivityCard, Loader, ActivityModal } from "@/components";

export default function History() {
  const { user } = useUserStore();
  const [giverActivities, setGiverActivities] = useState<Activity[]>([]);
  const [receiverActivities, setReceiverActivities] = useState<Activity[]>([]);
  const [giverPage, setGiverPage] = useState(1);
  const [receiverPage, setReceiverPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [modeActivityModel, setModeActivityModel] = useState<string>("close");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !user._id) {
        setError("עליך להתחבר כדי לצפות בהיסטוריה שלך");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const activities: Activity[] = await getFilteringActivities(
          "history",
          user._id
        );

        const giver = activities.filter(
          (activity: Activity) => activity.giverId === user._id
        );
        const receiver = activities.filter(
          (activity: Activity) => activity.receiverId === user._id
        );

        setGiverActivities(giver);
        setReceiverActivities(receiver);
      } catch (err: any) {
        setError(err.message || "שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const paginate = (activities: Activity[], page: number) =>
    activities.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const giverPaginated = paginate(giverActivities, giverPage);
  const receiverPaginated = paginate(receiverActivities, receiverPage);

  const handleMoreDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModeActivityModel("open");
  };

  const closeModal = () => {
    setModeActivityModel("close");
    setSelectedActivity(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <strong>ההיסטוריה שלך</strong>
      </h1>
      <h3 className={styles.explain}>
         כאן תוכלו לצפות בפעילויות שתרמתם ובפעילויות שלקחתם לעצמכם, כל
        הפעילויות שתכננתם והשלמתם יופיעו כאן.
      </h3>
      {loading ? (
        <Loader />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* giverActivities */}
          <section>
            <h2 className={styles.title}>פעילויות שתרמתי:</h2>
            <div className={styles.activityGrid}>
              <button
                disabled={giverPage === 1}
                onClick={() => setGiverPage((prev) => prev - 1)}
                className={styles.paginationButton}
              >
                <GrFormNextLink />
              </button>
              <div className={styles.act}>
                {giverPaginated.length > 0 ? (
                  giverPaginated.map((activity) => (
                    <ActivityCard
                      key={activity._id as string}
                      activity={activity}
                      onMoreDetails={() => handleMoreDetails(activity)}
                    />
                  ))
                ) : (
                  <p>לא נמצאו פעולות שתרמת</p>
                )}
              </div>
              <button
                disabled={
                  giverPage === Math.ceil(giverActivities.length / itemsPerPage)
                }
                onClick={() => setGiverPage((prev) => prev + 1)}
                className={styles.paginationButton}
              >
                <GrFormPreviousLink />
              </button>
            </div>
          </section>

          {/* receiverActivities */}
          <section>
            <h2 className={styles.title}>פעילויות שקיבלתי:</h2>
            <div className={styles.activityGrid}>
              <button
                disabled={receiverPage === 1}
                onClick={() => setReceiverPage((prev) => prev - 1)}
                className={styles.paginationButton}
              >
                <GrFormNextLink />
              </button>
              <div className={styles.act}>
                {receiverPaginated.length > 0 ? (
                  receiverPaginated.map((activity) => (
                    <ActivityCard
                      key={activity._id as string}
                      activity={activity}
                      onMoreDetails={() => handleMoreDetails(activity)}
                    />
                  ))
                ) : (
                  <p>לא נמצאו פעולות שקיבלת</p>
                )}
              </div>
              <button
                disabled={
                  receiverPage ===
                  Math.ceil(receiverActivities.length / itemsPerPage)
                }
                onClick={() => setReceiverPage((prev) => prev + 1)}
                className={styles.paginationButton}
              >
                <GrFormPreviousLink />
              </button>
            </div>
          </section>
        </div>
      )}
      {modeActivityModel === "open" && selectedActivity && (
        <ActivityModal
          modeModel={modeActivityModel}
          isModeCancellig={false}
          onClose={closeModal}
          activity={selectedActivity}
          user={user}
          handlesMoreOptions={{}}
        />
      )}
    </div>
  );
}
