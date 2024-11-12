import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {storeUser} from "./AuthManager";

export interface LoginResponse {
    admin: boolean,
    createdAt: string,
    email: string,
    id: number,
    is_new_user: boolean,
    name: string,
    nickname?: string,
    phone_number?: string,
    planes?: string,
    profile_image?: string,
    updated_at: string,
    user_id: string,
}

const SignInHandler: React.FC = () => {
    useEffect(() => {
        const authenticateUser = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token') || '';
            if (!token) {
                window.location.href = "https://auth.boundlessflight.net";
                return;
            }

            try {
                // Pass the JWT token in request headers
                const response = await axios.get<LoginResponse>('https://api.boundlessflight.net/api/token/getuser/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                if (response.data.user_id != null && response.data.user_id != "0") {
                    storeUser(token, response.data);
                    console.log("Signed in!")
                    window.location.href = "/dashboard";
                } else {
                    console.log("Not signed in!")
                    window.location.href = "https://auth.boundlessflight.net";
                }
            } catch (error) {
                console.log(error);
                window.location.href = "https://auth.boundlessflight.net";
            }
        };

        authenticateUser();
    }, []);

    return (
        <div>Redirecting...</div>
    );
};

export default SignInHandler;
