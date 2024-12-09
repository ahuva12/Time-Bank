import { http } from '@/services/http';

//registration and unregistration for activity (-update remainingHours of the giver and receiver and the status of athe activity)
export const registrationForActivity = async (activityId: string, giverId: string, receiverId: string, status:string) => {

    const body = { status, giverId, receiverId };

    try {
        const response = await http.patch(`/registrationActivity/${activityId}`, body);

        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.data}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error registration/unregistration for activity:', error);
        throw new Error(`Error registration/unregistration for activity: ${error}`);
    }
};