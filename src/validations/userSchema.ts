import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must have at least 10 characters"),
    gender: z.enum(["male", "female"]),
    dateOfBirth: z.coerce.date(), 
    password: z.string().min(5, "Password must be at least 8 characters long"),
    remainingHours: z.number().min(0, "Remaining hours must be 0 or greater"),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});
  