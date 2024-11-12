import axios from "axios";
import {LoginResponse} from "./SignInHandler";

export function storeUser(token:string, userData:LoginResponse) {
    console.log("Storing user data!");
    window.localStorage.setItem('token', token);
    let json = JSON.stringify(userData)
    window.localStorage.setItem('userData', json);
}

export function getToken() {
    return window.localStorage.getItem('token');
}

export function getUserData():any {
    return window.localStorage.getItem('userData');
}

export function clearUser() {
    console.log("Removing user data from storage");
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userData');
}

export function clearStorage() {
    console.log("Clearing all local storage.");
    window.localStorage.clear();
}

export async function makeAuthCall(url: string, method: string, data?: any) {
    console.log(data);
    let response = await axios({
        method: method,
        url: url,
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        data: data
    })
    if (response.status === 401 || response.status === 403) {
        clearUser();
        console.log("Authorization token has expired!!");
        //window.location.href = "https://auth.boundlessflight.net";
        return null;
    }
    return response;
}