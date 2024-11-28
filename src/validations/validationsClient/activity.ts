import { z } from "zod";

export const addActivityForm = z.object({
    nameActivity: z.string().min(1, "Activity name is required"),
    durationHours: z.number().min(0, "Duration hours must be 0 or greater"),
    tags: z.array(z.string().min(3, "Each tag must be at least 3 characters"))
    .max(5, "You can only add up to 5 tags")
    .optional()
    .default([]),
    description: z.string().min(1, "Description is required"),
});
