import { http } from '@/services/http';
import { User } from '@/types/user';

//send login request
export const loginUser = async (email: string, password: string, encrypted: boolean) => {
    const body = { email, password,encrypted };
    try {
        const response = await http.post("/login", body); 

        if (response.status !== 200) {
            throw new Error(`${response.status}: ${response.data}`);
        }
        return response.data.user;
        
    } catch (error:any) {
        console.error('Error Login:', error);
        throw new Error(`Error Login: ${error.response.data.error || error}`);
    }
};

//send register request
export const registerUser = async (newUser: User) => {
    try {
        const response = await http.post("/register", newUser);

        if (response.status !== 201) {
            throw new Error(`${response.status}: ${response.data}`);
        }

        return response.data;
    } catch (error:any) {
        console.error('Error register:', error);
        throw new Error(`Error register: ${error.response.data.error || error}`);
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

        return response.data.user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export const getUserByEmail= async (userEmail : string) => {
    try{
        const filter= { email: userEmail };
        const response= await http.post(`/users/filterUsers`, filter);
        if (response.status !== 200) {
            throw new Error(`User not found. EMAIL: ${userEmail}`);
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}