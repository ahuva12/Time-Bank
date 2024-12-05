import { http } from '@/services/http';
import { User } from '@/types/user';

//send login request
export const loginUser = async (email: string, password: string) => {
    const body = { email, password };

    try {
        const response = await http.post("/login", body);

        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.data}`);
        }

        return response.data.user;
    } catch (error) {
        console.error('Error login:', error);
        throw new Error(`Error login: ${error}`);
    }
};

//send register request
export const registerUser = async (newUser:User) => {

    try {
        const response = await http.post("/register", newUser);
        console.log(response)

        if (response.status !== 201) {
            throw new Error(`${response.status}: ${response.data}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error register:', error);
        throw new Error(`Error register: ${error}`);
    }
};

// update remainingHours of the giver and receiver
export const updateStatusActivity = async (giverId: string, receiverId: string, durationHoursActivity: number) => {

    if (typeof durationHoursActivity !== 'number' || durationHoursActivity <= 0) {
        throw new Error("Invalid hoursActivity value");
    }

    const body = { durationHoursActivity };

    try {
        const response = await http.patch(`/users/updatingRemainingHours/${giverId}/${receiverId}`, body);

        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.data}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error updating remainingHours:', error);
        throw new Error(`Error updating remainingHours: ${error}`);
    }
};

export const updateUser = async (updatedUser: User) => {
    try {
        const response = await http.patch(`/users/${updatedUser._id}`, updatedUser);

        if (response.status !== 200)
            throw new Error(`${response.status}: fail in updating user`);
      
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error(`'Error updating user: ${error}`);
    }
}

export const getUserById = async (userId: string) => {
    try {
      const response = await http.get(`/users/${userId}`);
      if (response.status !== 200) {
        throw new Error(`User not found. ID: ${userId}`);
      }
      // console.log("User data:", response.data);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
}