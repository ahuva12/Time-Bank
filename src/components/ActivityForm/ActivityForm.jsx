"use client";
import { useUserStore } from "@/store/useUserStore";
import Styles from "./ActivityForm.module.css";
import TagSelector from "../TagSelector/TagSelector";
import { useForm, SubmitHandler } from "react-hook-form";
import { addActivityForm } from "@/validations/validationsClient/activity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function ActivityForm({ activity, closePopup, handleAddActivity, handleUpdateActivity, isNew = false }) {
  const { register, handleSubmit, formState: { errors }, } = useForm({
    resolver: zodResolver(addActivityForm),
    defaultValues: {
      nameActivity: activity?.nameActivity,
      durationHours: String(activity?.durationHours),
      description: activity?.description,
    }
  });

  const [tags, setTags] = useState(activity.tags || []);
  const { user } = useUserStore();
  const [error, setError] = useState("");

  const onSubmit = async (data, event) => {
    console.log(event);
    if (event.nativeEvent.submitter.textContent === "×") {
      console.log(event.nativeEvent.submitter);
      return;
    } 
    try {
      const processedTags = typeof tags === "string"
        ? tags.split(",").map(tag => tag.trim())
        : tags;
      if (isNew) {
        const newActivity = {
          giverId: user._id,
          ...data,
          tags: processedTags,
        }
        newActivity.durationHours = Number(newActivity.durationHours);
        handleAddActivity(newActivity);
      }
      else {
        const updatedActivity = {
          ...activity,
          ...data,
          tags: processedTags,
        }
        updatedActivity.durationHours = Number(updatedActivity.durationHours);
        handleUpdateActivity(updatedActivity)
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      closePopup();
    }
  }

  const handleTagChange = (newTags) => {
    // setTags(newTags.join(", "));
    setTags(newTags);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.closeButton} onClick={closePopup}>
        &times;
      </div>
      <div className={Styles.heading}>
        {isNew ? "הוסף פעילות חדשה" : "פרטי הפעילות"}
      </div>
      <form
        // onSubmit={handleSubmit(onSubmit)}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          handleSubmit((data) => onSubmit(data, e))(e); // Pass both data and event to onSubmit
        }}
        className={Styles.form}
      >
        <div className={Styles.fieldContainer}>
          <input
            className={Styles.input}
            type="text"
            placeholder="שם הפעילות"
            {...register("nameActivity")}
          // required 
          />
          {errors.nameActivity && (
            <p className={Styles.errorMessage}>
              {String(errors.nameActivity.message)}
            </p>
          )}
        </div>
        <div className={Styles.fieldContainer}>
          <TagSelector
            className={Styles.tagSelector}
            // className={Styles.input}
            existingTags={activityTags}
            tags={tags}
            onTagsChange={handleTagChange}
          />
        </div>

        <div className={Styles.fieldContainer}>
          <input
            className={Styles.input}
            type="number"
            placeholder="מספר שעות"
            {...register("durationHours")}
          // required
          />
          {errors.durationHours && (
            <p className={Styles.errorMessage}>
              {String(errors.durationHours.message)}
            </p>
          )}
        </div>

        <div className={Styles.fieldContainer}>
          <input
            className={Styles.input}
            type="text"
            placeholder="תיאור"
            {...register("description")}
          // required
          />
          {errors.description && (
            <p className={Styles.errorMessage}>
              {String(errors.description.message)}
            </p>
          )}
        </div>
        <input
          className={Styles.loginButton}
          type="submit"
          value={isNew ? " הוספה" : "עדכון"}
        />
      </form>
    </div>
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
  "הופעות מוזיקה",
];