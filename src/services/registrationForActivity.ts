import { http } from '@/services/http';

//registration and unregistration for activity (=update remainingHours of the giver and receiver and the status of athe activity)
export interface RegistrationActivityPayload {
    activityId: string;
    giverId: string;
    receiverId: string;
    status: 'caughted' | 'proposed';
  }
  
  export const registrationForActivity = async ({activityId, giverId, receiverId, status,}: RegistrationActivityPayload): Promise<any> => {
    const body = { status, giverId, receiverId };
  
    try {
      const response = await http.patch(`/registrationActivity/${activityId}`, body);
      console.log(response)
  
      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.data}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error registration/unregistration for activity:', error);
      throw new Error(`Error registration/unregistration for activity: ${error}`);
    }
  };
  