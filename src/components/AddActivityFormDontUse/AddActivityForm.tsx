"use client";
import styles from "./AddActivityForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addActivityForm } from "@/validations/validationsClient/activity";
import { useState } from "react";

const predefinedTags = [
  "מוזיקה",
  "שיעור פרטי",
  "יצירה",
  "הדרכה",
  "עבודות בית",
  "ספורט",
  "בישול",
  "פנאי",
  "תחזוקה",
];

type AddActivityFormFileds = {
  nameActivity: string;
  durationHours: number;
  tags: string[];
  description: string;
};

const AddActivityForm = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddActivityFormFileds>({
    resolver: zodResolver(addActivityForm),
  });

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      setValue("tags", updatedTags);
    }
  };

  const handleCustomTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const tag = (e.currentTarget.value || "").trim();
    if (e.key === "Enter" && tag) {
      e.preventDefault();
      handleAddTag(tag);
      e.currentTarget.value = "";
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
    setValue("tags", updatedTags);
  };

  const onSubmit: SubmitHandler<AddActivityFormFileds> = (
    data: AddActivityFormFileds
  ) => {
    console.log("Form submitted:", data);
  };

  return (
    <form className={styles.AddActivityForm} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>הוספת פעילות חדשה</h2>

        <div>
            <label>שם הפעילות</label>
            <input
                type="text"
                {...register("nameActivity")}
            />
            {errors.nameActivity && <p>{String(errors.nameActivity.message)}</p>}
        </div>

        <div>
            <label>תיאור</label>
            <input
                type="text"
                {...register("description")}
            />
            {errors.description && <p>{String(errors.description.message)}</p>}
        </div>

        <div>
            <label>תגיות</label>
            <select
                onChange={(e) => handleAddTag(e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>בחר תגית</option>
                {predefinedTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="הוסף תגית חדשה"
                onKeyDown={handleCustomTagInput}
                />
            <div className={styles.TagList}>
                {selectedTags.map(tag => (
                    <span key={tag} className={styles.Tag}>
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)}>X</button>
                    </span>
                ))}
            </div>
            {errors.tags && <p>{String(errors.tags.message)}</p>}
        </div>

        <div>
            <label>משך זמן הפעילות</label>
            <input
                type="number"
                {...register("durationHours", { valueAsNumber: true })}
            />
            {errors.durationHours && <p>{String(errors.durationHours.message)}</p>}
        </div>

        <div>
            <button className={styles.submitButton} type="submit">הוספה</button>
        </div>
    </form>
    // <div className={styles.container}>
    //   <div className={styles.closeButton} onClick={closePopup}>
    //     &times;
    //   </div>
    //   <div className={styles.heading}>הוספת פעילות חדשה</div>
    //   <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
    //     <div className={styles.fieldContainer}>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="שם פעילות"
    //         {...register("nameActivity")}
    //       />
    //       {errors.nameActivity && (
    //         <p className={styles.errorMessage}>
    //           {String(errors.nameActivity.message)}
    //         </p>
    //       )}
    //     </div>

    //     <div className={styles.fieldContainer}>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="תיאור"
    //         {...register("description")}
    //       />
    //       {errors.description && (
    //         <p className={styles.errorMessage}>
    //           {String(errors.description.message)}
    //         </p>
    //       )}
    //     </div>

    //     <div className={styles.fieldContainer}>
    //       <input
    //         className={styles.input}
    //         type="number"
    //         placeholder="משך זמן הפעילות"
    //         {...register("durationHours", { valueAsNumber: true })}
    //       />
    //       {errors.durationHours && (
    //         <p className={styles.errorMessage}>
    //           {String(errors.durationHours.message)}
    //         </p>
    //       )}
    //     </div>

    //     <div className={styles.fieldContainer}>
    //       <select
    //         className={styles.input}
    //         onChange={(e) => handleAddTag(e.target.value)}
    //         defaultValue=""
    //       >
    //         <option value="" disabled selected>
    //           בחר תגית
    //         </option>
    //         {predefinedTags.map((tag) => (
    //           <option key={tag} value={tag}>
    //             {tag}
    //           </option>
    //         ))}
    //       </select>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="הוסף תגית חדשה"
    //         onKeyDown={handleCustomTagInput}
    //       />
    //       <div className={styles.TagList}>
    //         {selectedTags.map((tag) => (
    //           <span key={tag} className={styles.Tag}>
    //             {tag}
    //             <button type="button" onClick={() => handleRemoveTag(tag)}>
    //               X
    //             </button>
    //           </span>
    //         ))}
    //       </div>
    //       {errors.tags && (
    //         <p className={styles.errorMessage}>{String(errors.tags.message)}</p>
    //       )}
    //     </div>
    //     <input className={styles.loginButton} type="submit" value="הוספה" />
    //   </form>
    // </div>
  );
};

export default AddActivityForm;
