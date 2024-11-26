import { ObjectId } from "mongodb";

export interface Activity {
    _id?: string | ObjectId;
    nameActivity: string;
    durationHours: number; 
    description: string;
    tags: Array<string>;
    giverId: string | ObjectId;
    receiverId: string | ObjectId;
    status: "proposed" | "caught" | "accepted" | "cancelled";   
    comments?: string 
}
