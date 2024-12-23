import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(1, "חובה להזין שם פרטי"),
    lastName: z.string().min(1, "חובה להזין שם משפחה"),
    address: z.string().min(1, "חובה להזין כתובת"),
    email: z.string().email("כתובת המייל לא חוקית"),
    phoneNumber: z.string().min(10, "מספר טלפון צריך להיות באורך 10"),
    gender:  z.enum(["male", "female"]),
    dateOfBirth: z.coerce.date(),
    password: z.string().min(4, "סיסמא חייבת להכיל לפחות 4 ספרות"),
    remainingHours: z.number().min(0, "יתרת שעות לא חוקית").optional(),
    photoURL: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("כתובת המייל לא חוקית"),
    password: z.string().min(4, "סיסמא לא חוקית"),
});
  