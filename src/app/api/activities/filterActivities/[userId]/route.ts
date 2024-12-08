import { connectDatabase, getDocuments } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const getCaughtActivitiesFilter = (userId:string) => {
    return {
                $and: [
                {
                    receiverId: new ObjectId(userId),
                },
                {
                    status: 'caughted',
                },
                ],
            }
}

const getActivitiesHistoryFilter = (userId:string) => {
    return {
        $and: [
            { status: "accepted" },
            { 
                $or: [
                    { giverId: new ObjectId(userId) },
                    { receiverId: new ObjectId(userId) }
                ]
            }
        ]
        }
}

const getActivitiesProposedFilter = (userId:string) => {
    return {
            $and: [
                    {
                        giverId: { $ne: new ObjectId(userId) }, 
                    },
                    {
                        status: 'proposed',
                    },
                ]
        }
}

const getCaughtActivitiesGiverFilter = (userId:string) => {
    return {
        $and: [
                {
                    giverId: new ObjectId(userId),
                },
                {
                    status: 'caughted',
                },
            ]
        }
}

const getProposedActivitiesGiverFilter = (userId:string) => {
    return {
        $and: [
            {
                giverId: new ObjectId(userId),
            },
            {
                receiverId: null,
            },
            {
                status: 'proposed',
            },
        ]
    }
}

export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { filterType } = await req.json(); 
        const { userId } = params;

        if (!filterType || !userId) {
            return NextResponse.json(
                { message: 'Invalid request. filterType and userId are required.' },
                { status: 400 }
            );
        }

        let filter;

        switch (filterType) {
            case 'caughted':
                filter = getCaughtActivitiesFilter(userId); 
                break;
            case 'history':
                filter = getActivitiesHistoryFilter(userId); 
                break;
            case 'proposed':
                filter = getActivitiesProposedFilter(userId); 
                break;
            case 'caughtedGiver':
                filter = getCaughtActivitiesGiverFilter(userId); 
                break;
            case 'proposedGiver':
                filter = getProposedActivitiesGiverFilter(userId); 
                break;
             
            default:
                return NextResponse.json(
                    { message: 'Invalid filter type provided.' },
                    { status: 400 }
                );
        }

        const client = await connectDatabase();
        const activities = await getDocuments(client, 'activities', filter);

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { message: 'Error fetching activities' },
            { status: 500 }
        );
    }
}
