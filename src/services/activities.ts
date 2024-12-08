import { http } from '@/services/http';
import { Activity } from '@/types/activity';

//get activities based on filtering 
//(the filters are can be: 'caughted', 'history', 'proposed', 'caughtedGiver', 'proposedGiver')
export const getFilteringActivities = async (filterType:string, userId:string) => {

  const body = { filterType };

  try {
    const response = await http.post(`/activities/filterActivities/${userId}`, body); 
    if (response.status !== 200)
      throw new Error(`${response.status}: error fetching activities`);

    return response.data; 

  } catch (error: any) {
      console.error('Error:', error.message);
      throw new Error(error.message);
  }
};

// Post activitiy
export const postActivity = async (newActivity: Activity) => {
    try {
      const response = await http.post('/activities', newActivity);

      if (response.status !== 201)
        throw new Error(`${response.status}: error posting activitiy`);

      return response.data;
    } catch (error: any) {
      console.error('Error posting activitiy:', error);
      throw new Error(`'Error posting activitiy: ${error.message}`);
    }
  };

//update activitiy
export const updateActivity = async (updatedActivity:Activity) => {
    try {
        const response = await http.patch(`/activities/${updatedActivity._id}`, updatedActivity);

        if (response.status !== 200)
          throw new Error(`${response.status}: fail in updating activitiy`);

        
        return response.data;
      } catch (error) {
        console.error('Error updating activitiy:', error);
        throw new Error(`'Error updating activitiy: ${error}`);
    }
}

//update status activitiy
export const updateStatusActivity = async ({ activityId, status, receiverId }: { 
  activityId: string;
  status: string;
  receiverId: string|null;}) => {

  if (!receiverId || !activityId || !status) {
    throw new Error('Receiver ID, activityId and status are required');
  }

  const body = { status, receiverId };

  try {
    const response = await http.patch(`/activities/updatingStatus/${activityId}`, body);

    if (response.status !== 200) {
      throw new Error(`${response.status}: Failed to update activity`);
    }

    return response.data;
  } catch (error: any) {
    console.error('Error updating activity:', error.message || error);
    throw new Error(`Error updating activity: ${error.message || error}`);
  }
};








