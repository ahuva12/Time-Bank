import { http } from '@/services/http';
import { Activity } from '@/types/activity';
// import { updateRemainingHours } from './users';

//get activities based on filtering 
//(the filters are can be: 'caughted', 'history', 'proposed', 'caughtedGiver', 'proposedGiver')
export const getFilteringActivities = async (filterType:string, userId:string) => {
  console.log('getFilteringActivities');
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
      console.log(`Request URL: /activities/${updatedActivity._id}`);

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

  if (!activityId || !status) {
    throw new Error('ActivityId and status are required');
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

//Registration or unregistering for an activity
// export const registrationForActivity = async (
//   activityId: string,
//   durationHoursActivity: number,
//   giverId: string,
//   receiverId: string,
//   status: 'accepted' | 'proposed'
// ) => {
//   try {
//     const resUpdateRemainingHours = await updateRemainingHours(giverId, receiverId, durationHoursActivity);    
//     if (!resUpdateRemainingHours) {
//       throw new Error('Error updating remaining hours');
//     }

//     const resUpdateStatusActivity = await updateStatusActivity({ activityId, status, receiverId });
//     if (!resUpdateStatusActivity) {
//       throw new Error('Error updating activity status');
//     }

//     return { success: true, message: 'Successfully registered for activity' };
    
//   } catch (error:any) {
//     console.error('Error in registering for activity:', error);
//     throw new Error(`Error registering for activity: ${error.message || error}`);
//   }
// };




