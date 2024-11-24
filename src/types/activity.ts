export interface Activity {
    _id?: string;
    nameActivity: string;
    durationHours: number; 
    description: string;
    giverId: string;
    receiverId: string;
    status: "proposed" | "caught" | "accepted" | "cancelled";   
}
