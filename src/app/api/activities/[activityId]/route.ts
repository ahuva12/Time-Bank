import { connectDatabase, deleteDocument, getDocument, updateDocument, getDocuments } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { activitySchema } from "@/validations/validationsServer/activity";
import { z } from "zod";
import { Activity } from '@/types/activity';

export async function DELETE(req: Request, { params }: { params: Promise<{ activityId: string }> }) {
    try {
        const { activityId } = await params;
        if (!activityId) {
            return NextResponse.json({ message: "activity ID is required" }, { status: 400 });
        }

        const client = await connectDatabase();
        const result = await deleteDocument(client, 'activities', { _id: new ObjectId(activityId) });

        if (result.deletedCount === 1) {
            return NextResponse.json({ message: "Activity deleted successfully" }, {status: 200});
        } else {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ activityId: string }> }) {
    try {
        console.log("in api/activities/id")
        const { activityId } = await params;
        const body = await req.json(); 
        if (!activityId) {
            return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
        }
        
        const validatedActivity = activitySchema.parse(body);

        const { _id, ...updateFields } = body;
        updateFields.giverId = new ObjectId(body.giverId)

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 });
        }

        const client = await connectDatabase();
        const result = await updateDocument(client, 'activities', { _id: new ObjectId(activityId) }, updateFields);

        if (result.modifiedCount === 1) { 
            return NextResponse.json({ message: "Activity updated successfully" }, {status: 200});
        } else {
            if (result.matchedCount === 1)
                return NextResponse.json({ message: "No changes made" }, { status: 204 });
            else
                return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// //get activities in status that the user is not giverId
// export async function GET(req: Request, { params }: { params: Promise<{ activityId: string }> }) {
//     try {
//         const { activityId } = await params;
//         if (!activityId) {
//             return NextResponse.json({ message: "activity ID is required" }, { status: 400 });
//         }

//         const client = await connectDatabase();
//         const activities = await getDocuments(client, 'activities', { giverId: { $ne: new ObjectId(activityId) } });
//         return NextResponse.json(activities);

//     } catch (error) {
//         console.error("Error fetching activities:", error);
//         return NextResponse.json({ message: "Failed to fetch activities" }, { status: 500 });
//     }
// }
