import { connectDatabase, deleteDocument, getDocument, updateDocument, getDocuments } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

//get activities in status "accepted" + the user in giverId or receiverId
export async function GET(req: Request, { params }: { params: Promise<{ activityId: string }> }) {
    try {
        const { activityId } = await params;
        if (!activityId) {
            return NextResponse.json({ message: "activity ID is required" }, { status: 400 });
        }

        const client = await connectDatabase();
        const activities = await getDocuments(client, 'activities', { 
            $and: [
                { status: "accepted" },
                { 
                    $or: [
                        { giverId: new ObjectId(activityId) },
                        { receiverId: new ObjectId(activityId) }
                    ]
                }
            ]
        });        
        return NextResponse.json(activities);

    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ message: "Failed to fetch activities" }, { status: 500 });
    }
}

//general get activities (according by filter)
export async function POST(req: Request) {
    try {
        const { filter } = await req.json();

        console.log(filter)
        const client = await connectDatabase();
        const activities = await getDocuments(client, 'activities', filter);

        if (!activities.length) {
            return NextResponse.json({ message: "No activities found" }, { status: 404 });
        }

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ message: 'Error fetching activities' }, { status: 500 });
    }
}

