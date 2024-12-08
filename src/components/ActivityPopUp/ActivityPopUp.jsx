'use client';
import { useState } from "react";
import useUserStore from "@/store/useUserStore";
import Styles from './ActivityPopUp.module.css'
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { updateActivity } from '@/services/activities'

export default function ActivityPopUp({activity, closePopup}) {
  const [nameActivity, setNameActivity] = useState(activity.nameActivity);
  const [tags, setTags] = useState(activity.tags);
  const [numberOfHours, setNumberOfHours] = useState(activity.numberOfHours);
  const [description, setDescription] = useState(activity.description);
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const updateActivityMutation = useMutation({
    mutationFn: updateActivity,
    onMutate: async (updatedActivity) => {
      await queryClient.cancelQueries({ queryKey: ['activities'] });
      const previousActivities = queryClient.getQueryData(['activities']);
      queryClient.setQueryData(['activities'], (old) =>
        old
          ? old.map((activity) =>
              activity._id === updatedActivity._id
                ? { ...activity, ...updatedActivity }
                : activity
            )
          : []
      );
      return { previousActivities };
    },
    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['activities'], context.previousActivities);
      }
      console.error('Error updating activity:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      updateActivityMutation.mutate({...activity, nameActivity: nameActivity, tags: tags, durationHours: numberOfHours, description: description}, {
        onSuccess: () => {
            console.log('Activity updated successfully!');
        },
        onError: (error) => {
            console.error('Failed to update activity:', error);
        },
      });
      closePopup();
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={Styles.container}>
        <h1 className={Styles.title}>פרטי הפעילות</h1>
      <input className={Styles.inputFields}
        type="text"
        placeholder="שם הפעילות"
        value={nameActivity}
        onChange={(e) => setNameActivity(e.target.value)}
        required
      />
      <input className={Styles.inputFields}
        type="text"
        placeholder="תגיות"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        required
      />
      <input className={Styles.inputFields}
        type="number"
        placeholder="מספר שעות"
        value={numberOfHours}
        onChange={(e) => setNumberOfHours(e.target.value)}
        required
      />
      <input className={Styles.inputFields}
        type="text"
        placeholder="תיאור"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className={Styles.innerDiv}>
        <button className={Styles.button} type="submit">עדכון</button>
      </div>
      {error && <p>{error}</p>}
      </div>
    </form>
  );
}
