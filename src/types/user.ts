import { ObjectId } from "mongodb";

export interface User {
    _id?: string | ObjectId;
    firstName: string;
    lastName: string; 
    address: string;
    email: string;
    phoneNumber: string;
    gender: "male" | "female";   
    dateOfBirth: Date;
    password: string;
    remainingHours: number;
}

