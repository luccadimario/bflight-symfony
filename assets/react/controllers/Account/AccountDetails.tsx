import React, {useEffect, useState} from "react";
import AccountDashboard from './AccountDashboard'
import Navbar from "../Navbar/Navbar";
import NavbarHelper from "../Navbar/NavbarHelper";
export default function AccountDetails() {
    const [acctDetails, setAcctDetails] = useState<accountDetails | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        console.log("Here!");
        const details: accountDetails = {
            profileImgPath: "/images/profile.png",
            name: "Vinny",
            nickname: "Big Vinny",
            email: "Vinny@vinnysaj.net",
            phoneNumber: "717-888-0093",
            dateJoined:"2-1-24"
        }
        setAcctDetails(details);
    }, [])
    return (
        <div className={"w-full h-screen"}>
        <Navbar pageTitle={"Plane Dashboard"} />
        <NavbarHelper />
        <div className="flex justify-center h-4/5 overflow-hidden">
            <div className="absolute justify-center items-center mt-8 h-3/4 w-1/2 min-h-max min-w-max rounded-2xl bg-gray-200 shadow-xl">
                {acctDetails ? <AccountDashboard accountDetailsProps={acctDetails}/> : <p>Loading...</p>}
            </div>
        </div>
        </div>
    )
}

export interface accountDetails {
    profileImgPath: string,
    name: string,
    nickname: string,
    email: string,
    phoneNumber: string,
    dateJoined: string,
}