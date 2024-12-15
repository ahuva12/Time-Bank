'use client';
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import Styles from './ActivityForm.module.css';
import { postActivity, updateActivity } from '@/services/activities'; // Add createActivity
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TagSelector from "../TagSelector/TagSelector";
import { strict } from "assert";

export default function ActivityPopUp({ activity, closePopup, setIsSuccessMessage, isNew = false }) {
  const [nameActivity, setNameActivity] = useState(activity.nameActivity || "");
  const [tags, setTags] = useState(activity.tags || []);
  const [numberOfHours, setNumberOfHours] = useState(activity.durationHours || "");
  const [description, setDescription] = useState(activity.description || "");
  const [error, setError] = useState("");
  
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const mutationFunc = isNew ? postActivity : updateActivity; // Use create or update function

  const activityMutation = useMutation({
    mutationFn: mutationFunc,
    onMutate: async (activityData) => {
      await queryClient.cancelQueries({ queryKey: ['activities'] });
      const previousActivities = queryClient.getQueryData(['activities']);
      if (!isNew) {
        queryClient.setQueryData(['activities'], (old) =>
          old
            ? old.map((activity) =>
              activity._id === activityData._id
                ? { ...activity, ...activityData }
                : activity
            )
            : []
        );
      } else {
        queryClient.setQueryData(['activities'], (old) => [...(old || []), activityData]);
      }
      return { previousActivities };
    },
    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['activities'], context.previousActivities);
      }
      console.error(`${isNew ? 'Adding' : 'Updating'} activity failed:`, error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const handleTagChange = (newTags) => {
    
    setTags(newTags.join(', '));
    console.log(newTags, tags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedTags = typeof tags === "string"
        ? tags.split(",").map(tag => tag.trim())
        : tags;

      setIsSuccessMessage(true);
      activityMutation.mutate(
        {
          ...(isNew ?{ giverId:  /*ObjectId(*/user._id } : activity), // Include existing data for updates
          nameActivity,
          tags: processedTags,
          durationHours: Number(numberOfHours),
          description,
        },
        {
          onSuccess: () => {
            console.log(`${isNew ? 'Activity added' : 'Activity updated'} successfully!`);
          },
          onError: (error) => {
            console.error(`Failed to ${isNew ? 'add' : 'update'} activity:`, error);
          },
        }
      );
      closePopup();
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={Styles.container}>
        <h1 className={Styles.title}>{isNew ? 'הוסף פעילות חדשה' : 'פרטי הפעילות'}</h1>
        <input
          className={Styles.inputFields}
          type="text"
          placeholder="שם הפעילות"
          value={nameActivity}
          onChange={(e) => setNameActivity(e.target.value)}
          required
        />
        <TagSelector className={Styles.tagSelector} existingTags={activityTags} tags={tags} onTagsChange={handleTagChange} />
        {/* <input
          className={Styles.inputFields}
          type="text"
          placeholder="תגיות"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        /> */}
        <input
          className={Styles.inputFields}
          type="number"
          placeholder="מספר שעות"
          value={numberOfHours}
          onChange={(e) => setNumberOfHours(e.target.value)}
          required
        />
        <input
          className={Styles.inputFields}
          type="text"
          placeholder="תיאור"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className={Styles.innerDiv}>
          <button className={Styles.button} type="submit">{isNew ? 'הוסף' : 'עדכון'}</button>
        </div>
        {error && <p>{error}</p>}
      </div>
    </form>
  );
}


const activityTags = [
  "ספורט",
  "טיולים",
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
  "לימודים",
  "מדיטציה",
  "כושר",
  "יוגה",
  "קולנוע",
  "תיאטרון",
  "טכנולוגיה",
  "מחשבים",
  "עיצוב",
  "רכיבה על אופניים",
  "שחייה",
  "ברידג'/שחמט",
  "כתיבה יוצרת",
  "אופנה",
  "נסיעות",
  "בריאות ורווחה",
  "משחקי מחשב",
  "מלאכת יד",
  "קרמיקה",
  "לימודי שפה",
  "טיול בטבע",
  "קמפינג",
  "פאזלים",
  "חקר היסטוריה",
  "אירועים חברתיים",
  "ספרות",
  "אסטרונומיה",
  "הופעות מוזיקה"
];