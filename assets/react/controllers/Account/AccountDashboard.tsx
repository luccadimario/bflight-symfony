import React, {ReactElement, useEffect, useRef, useState} from 'react';
import axios from "axios";
import {accountDetails} from "./AccountDetails";
import {makeAuthCall} from "../AuthManager/AuthManager";

export default function AccountDashboard(props: {accountDetailsProps: accountDetails}) {
    const [accountDetailsProps, setAccountDetailsProps] = useState(props.accountDetailsProps);
    const handleFile = (file: any) => {
        let url = "https://api.boundlessflight.net/api/aircraft/update/coverphoto"
        let data = {

        }
        let response = makeAuthCall(url, "POST", null);
        console.log("File Accepted");
    }
    function setProfilePicture(){
        console.log("Profile picture has been set.");
        hiddenFileInput.current.click();
    };
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null);
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    return (
        <>
            <div className="flex justify-center items-center py-4">
                <div className="flex-col flex-1 mt-2 justify-center">
                    <div className={"w-full h-64 flex justify-center items-center"}>
                        <div className="relative">
                            <img className="w-40 h-40 rounded-full" src={accountDetailsProps.profileImgPath} alt="Rounded avatar"/>
                            <div onClick={setProfilePicture}
                                className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
                                </svg>
                                <input
                                    type="file"
                                    onChange={handleChange}
                                    ref={hiddenFileInput}
                                    style={{display: 'none'}} // Make the file input element invisible
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"flex-1 text-center"}>
                        <div className={"mt-2"}>
                        <div className="font-extrabold text-sm text-gray-500">Name</div>
                            <div className={"text-gray-800 -mt-1"}>{accountDetailsProps.name}</div>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">Nickname</div>
                            <div className={"text-gray-800 -mt-1"}>{accountDetailsProps.nickname}</div>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">Date Joined</div>
                            <div className={"text-gray-800 -mt-1"}>{accountDetailsProps.dateJoined}</div>
                        </div>
                    </div>
                    <div className={"w-full flex"}>
                        <div className={"flex-1 text-center"}>
                            <div className={"mt-2"}>
                                <div className="font-extrabold text-sm text-gray-500">Email</div>
                                <div className={"text-gray-800 -mt-1"}>{accountDetailsProps.email}</div>
                            </div>
                        </div>
                        <div className={"flex-1 text-center"}>
                            <div className={"mt-2"}>
                                <div className="font-extrabold text-sm text-gray-500">Phone Number</div>
                                <div className={"text-gray-800 -mt-1"}>{accountDetailsProps.phoneNumber}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};



