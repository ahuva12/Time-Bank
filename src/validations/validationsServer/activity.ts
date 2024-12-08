import { ObjectId } from "mongodb";
import { z } from "zod";

export const activitySchema = z.object({
    nameActivity: z.string().min(1, "Activity name is required"),
    durationHours: z.number().min(0, "Duration hours must be 0 or greater"),
    description: z.string().min(1, "Description is required"),
    giverId: z.string().min(1, "Giver ID is required"),
    receiverId: z.string().min(1, "Receiver ID is required"),
    status: z.enum(["proposed", "caught", "accepted", "cancelled"])
});

export const updatingStatusSchema = z.object({
    receiverId: z.string().refine((value) => ObjectId.isValid(value), {
        message: "Invalid ObjectId format",
    }), 
    status: z.enum(["proposed", "caughted", "accepted", "cancelled"]),
});

