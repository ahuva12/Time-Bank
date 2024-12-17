"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import styles from "./profile.module.css";
import { useUserStore } from "@/store/useUserStore";
import { userSchema } from "@/validations/validationsClient/user";
import { updateUser } from "@/services/users";
import { FaEdit } from "react-icons/fa";
import { Activity } from "@/types/activity";
import { getFilteringActivities } from "@/services/activities";
import { CiUser } from "react-icons/ci";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import PasswordModal from "@/components/PasswordModal/PasswordModal";
import { useAuthStore } from "@/store/authStore";
import Wallet from "@/components/Wallet/Wallet";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Define Zod schema for the form
const editableFieldsSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  address: true,
});

type EditableFields = z.infer<typeof editableFieldsSchema>;

// Field mappings for Hebrew labels
const fieldMappings: { [key in keyof EditableFields]: string } = {
  firstName: "שם פרטי",
  lastName: "שם משפחה",
  email: "אימייל",
  phoneNumber: "טלפון",
  address: "כתובת",
};

interface Wallet {
  hoursGiven: number;
  hoursReceived: number;
  hoursToReceive?: number;
}

const Profile: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true); 
  }, [isLoggedIn]);

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const [editingField, setEditingField] = useState<keyof EditableFields | null>(
    null
  );
  const [wallet, setWallet] = useState<Wallet>({
    hoursGiven: 0,
    hoursReceived: 0,
    hoursToReceive: 0,
  });

  const getWallet = async () => {
    try {
      const activities: Activity[] = await getFilteringActivities(
        "history",
        user._id as string
      );
      const hoursGiven = activities.filter(
        (activity) => activity.giverId === user._id
      ).length;
      const hoursReceived = activities.filter(
        (activity) => activity.receiverId === user._id
      ).length;
      const hoursToReceive = user.remainingHours;

      setWallet({ hoursGiven, hoursReceived, hoursToReceive });
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

  // Fetch wallet data when the component mounts
  useEffect(() => {
    if (user?._id) {
      getWallet();
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePasswordChange = async (newPassword: string) => {
    try {
      const updatedUser = { ...user, password: newPassword };
      const response = await updateUser(updatedUser);
      setUser(updatedUser);
      alert("הסיסמא שלך שונתה בהצלחה!");
    } catch (error) {
      console.error("שינוי הסיסמא שלך נכשנל... נסה שוב בעוד מספר דקות", error);
      alert("Failed to update profile.");
    }
  };

  // Form handling using React Hook Form and Zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditableFields>({
    resolver: zodResolver(editableFieldsSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    },
  });

  const onSubmit = async (data: EditableFields) => {
    console.log(data);
    try {
      console.log(data);
      const updatedUser = { ...user, ...data };
      const response = await updateUser(updatedUser);
      setUser(updatedUser);
      alert("הפרופיל שלך עודכן בהצלחה!");
      setEditingField(null); // Close the input field after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("עדכון הפרופיל שלך נכשל... נסה שוב שעוד משפר דקות");
    }
  };

  const handleEditClick = (field: keyof EditableFields) => {
    setEditingField(field);
    setValue(field, user[field]); // Pre-fill the input with the current value
  };

  const Form = () => {
    // if (!isLoggedIn && isInitialized) {
    //   return (
    //     <ErrorMessage
    //       message_line1="אתה לא מחובר!"
    //       message_line2="עליך להכנס לאתר/להרשם אם אין לך חשבון"
    //       link="/home"
    //     />
    //   );
    // }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(editableFieldsSchema.shape).map((field) => (
          <>
            <div key={field} className={styles.field}>
              <span className={styles.wrapperRow}>
                <p className={styles.label}>
                  {fieldMappings[field as keyof EditableFields]}
                </p>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => handleEditClick(field as keyof EditableFields)}
                />
              </span>
              {editingField === field ? (
                <div className={styles.editWrapper}>
                  <div className={styles.wrapperRow}>
                    <input
                      {...register(field as keyof EditableFields)}
                      className={styles.editInput}
                      autoFocus
                    />
                    <div className={styles.buttonWrapper}>
                      <button type="submit" className={styles.saveBtn}>
                        שמור
                      </button>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => setEditingField(null)}
                      >
                        בטל
                      </button>
                    </div>
                  </div>
                  {errors[field as keyof EditableFields] && (
                    <p className={styles.error}>
                      {errors[field as keyof EditableFields]?.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className={styles.value}>
                  {user[field as keyof EditableFields]}
                </p>
              )}
            </div>
          </>
        ))}
      </form>
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          {user.gender === "female" ? (
            <DotLottieReact
              className={styles.icon}
              src="https://lottie.host/15aac7a1-b7b2-4340-b8f8-02eab363e880/ceE1Czg7gO.lottie"
              loop
              autoplay
            />
          ) : (
            <DotLottieReact
              className={styles.icon}
              src="https://lottie.host/83af3d68-b7da-4527-bad5-ba99dc3455b2/Y1TNg89TDr.lottie"
              loop
              autoplay
            />
          )}
          <h2 className={styles.welcome}>שלום, {user.firstName}!</h2>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.column}>
            <Form />
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.changeBtn}
              >
                שנה סיסמה
              </button>
              {isModalOpen && (
                <PasswordModal
                  user={user}
                  onClose={() => setIsModalOpen(false)}
                  onSubmit={handlePasswordChange}
                />
              )}
            </>
          </div>
          <div className={styles.column}>
            <div className={styles.walletContainer}>
              <Wallet
                hoursGiven={wallet.hoursGiven}
                hoursReceived={wallet.hoursReceived}
                hoursRemaining={wallet.hoursToReceive}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
