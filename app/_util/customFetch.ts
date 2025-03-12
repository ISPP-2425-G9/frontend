import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API } from "@/constants/Mysc";
import { USER_STORAGE_KEY, UserType } from "./useAuth";

/**
 * 
 * This method allows you to perform a fetch in which the authorization
 * header is automatically added if authenticated and the domain where
 * the API is located.
 * 
 * 
 * @param url  Backend API Endpoint
 * @param init Request headers and body 
 * @returns 
 */
export async function customFetch(
    url: RequestInfo | URL,
    init: RequestInit = {}
) { 
    const userData: string | null = await AsyncStorage.getItem(USER_STORAGE_KEY)
    const headers = new Headers(init.headers);
    if(userData !== null) {
        const user: UserType = JSON.parse(userData);
        const token: string = user?.token
        if (token) {
            headers.set("Authorization", "Bearer " + token);
        }
    }

    return await fetch(BACKEND_API + url, {
        ...init,
        headers,
    });
}