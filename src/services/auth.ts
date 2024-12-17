import {provider} from "@/utils/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export async function googleSignIn(): Promise<any> {
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log("Token:", token);
        console.log("User:", user);
        return { token, user };
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
}