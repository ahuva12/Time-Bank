import { http } from '@/services/http';
import { Activity } from '@/types/activity';
// import { ObjectId } from 'mongodb';

// //get activities that the current user is the giver and their status is "wanted"
export const getCaughtActivities = async (userId:string) => {
  const body = {
    filterType: 'caughted'
  };

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

// //get activities the user has given or received (for history page)
// export const getActivitiesHistory = async (userId:string) => {
//     const user_objectId =  new ObjectId(userId);
//     const body = {
//         filter: {
//           $or: [
//             {
//               $and: [
//                 { giverId: user_objectId },
//                 { status: 'accepted' }
//               ]
//             },
//             {
//               $and: [
//                 { receiverId: user_objectId },
//                 { status: 'accepted' }
//               ]
//             }
//           ]
//         }
//       };

//     try {
//       const response = await http.post(`/activities/filterActivities/${userId}`, body); 
//       if (response.status !== 200)
//         throw new Error(`${response.status}: error fetching activities`);

//       return response.data; 

//     } catch (error: any) {
//         console.error('Error:', error.message);
//         throw new Error(error.message);
//     }
// };

// //get all activities proposed
// export const getActivitiesProposed = async (userId:string) => {
//     const body = {
//         filter: {
//           $and: [
//             {
//                 giverId: { $ne: new ObjectId(userId) }, 
//             },
//             {
//                 status: 'proposed',
//             },
//           ],
//         },
//       };

//     try {
//       const response = await http.post(`/activities/filterActivities/${userId}`, body); 
//       if (response.status !== 200)
//         throw new Error(`${response.status}: error fetching activities`);

//       return response.data; 

//     } catch (error: any) {
//         console.error('Error:', error.message);
//         throw new Error(error.message);
//     }
// };

// //get activities that the user has marked as "wanted"
// export const getCaughtActivities = async (userId:string) => {   
//     console.log('getCaughtActivities')
//     const body = {
//         filter: {
//           $and: [
//             {
//                 receiverId: new ObjectId(userId),
//             },
//             {
//                 status: 'caught',
//             },
//           ],
//         },
//       };

//     try {
//       const response = await http.post(`/activities/filterActivities/${userId}`, body); 
//       if (response.status !== 200)
//         throw new Error(`${response.status}: error fetching activities`);

//       return response.data; 

//     } catch (error: any) {
//         console.error('Error:', error.message);
//         throw new Error(error.message);
//     }
// };

// //get activities that the current user is the giver and their status is "wanted"
// export const getCaughtActivitiesGiven = async (userId:string) => {   
//     const body = {
//         filter: {
//           $and: [
//             {
//                 giverId: new ObjectId(userId),
//             },
//             {
//                 status: 'caught',
//             },
//           ],
//         },
//       };

//     try {
//       const response = await http.post(`/activities/filterActivities/${userId}`, body); 
//       if (response.status !== 200)
//         throw new Error(`${response.status}: error fetching activities`);

//       return response.data; 

//     } catch (error: any) {
//         console.error('Error:', error.message);
//         throw new Error(error.message);
//     }
// };

// //get activities that the current user is the giver and their status is "proposed"
// export const getProposedActivitiesGiven = async (userId:string) => {   
//     const body = {
//         filter: {
//           $and: [
//             {
//                 giverId: new ObjectId(userId),
//             },
//             {
//                 status: 'proposed',
//             },
//           ],
//         },
//       };

//     try {
//       const response = await http.post(`/activities/filterActivities/${userId}`, body); 
//       if (response.status !== 200)
//         throw new Error(`${response.status}: error fetching activities`);

//       return response.data; 

//     } catch (error: any) {
//         console.error('Error:', error.message);
//         throw new Error(error.message);
//     }
// };

// // Post activitiy
// export const postActivity = async (newActivity: Activity) => {
//     try {
//       const response = await http.post('/activities', newActivity);

//       if (response.status !== 201)
//         throw new Error(`${response.status}: error posting activitiy`);

//       return response.data;
//     } catch (error: any) {
//       console.error('Error posting activitiy:', error);
//       throw new Error(`'Error posting activitiy: ${error.message}`);
//     }
//   };

// //update activitiy
// export const updateActivity = async (updatedActivity:Activity) => {
//     try {
//         const response = await http.patch(`/activities/${updatedActivity._id}`, updatedActivity);

//         if (response.status !== 200)
//           throw new Error(`${response.status}: fail in updating activitiy`);

        
//         return response.data;
//       } catch (error) {
//         console.error('Error updating activitiy:', error);
//         throw new Error(`'Error updating activitiy: ${error}`);
//     }
// }

// //update status activitiy
// export const updateStatusActivity = async (activityId:string, status:string, receiverId?:string) => {

//     const body: Record<string, any> = { status };
//     if (receiverId) {
//       body.receiverId = new ObjectId(receiverId); 
//     }

//     try {
//         const response = await http.patch(`/activities/updatingStatus/${activityId}`, body);

//         if (response.status !== 200)
//           throw new Error(`${response.status}: fail in updating activitiy`);

        
//         return response.data;
//       } catch (error) {
//         console.error('Error updating activitiy:', error);
//         throw new Error(`'Error updating activitiy: ${error}`);
//     }
// }





