import { ObjectId } from "mongodb";

export interface Activity {
    _id?: string | ObjectId;
    nameActivity: string;
    durationHours: number; 
    description: string;
    tags: Array<string> | [];
    giverId: string | ObjectId;
    receiverId: string | ObjectId | null;
    status: "proposed" | "caughted" | "accepted" | "cancelled";   
    comments?: string 
}

// export interface Activity {
//     _id?: string | ObjectId;
//     giverId: string | ObjectId;
//     receiverId?: string | ObjectId | null;
//     nameActivity: string;
//     tags: string[] | [];
//     durationHours: number;
//     description: string;
//     status?: "proposed" | "accepted" | "cancelled";
//     comments?: string;
//   }
  