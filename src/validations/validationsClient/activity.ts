import { z } from "zod";

export const addActivityForm = z.object({
    nameActivity: z.string().min(1, "חובה להזין שם פעילות"),
    durationHours: z.number().min(0, "משך זמן הפעילות חייב להיות גדול מ1"),
    tags: z.array(z.string().min(3, "תגית חייבת להכיל לפחות 3 תווים"))
    .max(5, "אתה יכול להכניס רק 5 תגיות")
    .optional()
    .default([]),
    description: z.string().min(1, "חובה להזין תיאור פעילותd"),
});
