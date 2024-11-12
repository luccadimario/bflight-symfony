import React, {useState} from 'react';
import {accountDetails} from "./AccountDetails";

export default function AccountDashboard(props: {accountDetailsProps: accountDetails}){
    const [accountDetailsProps, setAccountDetailsProps] = useState(props.accountDetailsProps);
    const[isEditingNick, setIsEditingNick] = useState(false);

    const handleSetIsEditingNick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsEditingNick(true);
    }
    const handleSetDoneIsEditingNick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsEditingNick(false);
    }
    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountDetailsProps(prevDetails => ({ ...prevDetails, name: event.target.value }));
    }



    return (
        <>
            <div className="flex justify-center items-center">
                <div className="flex-col flex-1 mt-2 justify-center">
                    <div className={"w-full h-64 flex justify-center items-center"}>
                        <img className="w-40 h-40 rounded-full" src={accountDetailsProps.profileImgPath} alt="Rounded avatar"/>
                    </div>
                    <div className={"flex-1 text-center"}>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">Name</div>
                            <div className={"text-gray-800 -mt-1"}>{accountDetailsProps.name}</div>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">Nickname</div>
                            {isEditingNick ?
                                <>
                                <input
                                    className={"rounded-lg outline-none bg-gray-100 -mt-1"}
                                    type="name"
                                    value={accountDetailsProps.nickname}
                                    onChange={handleNicknameChange}
                                    name="tailNumber">
                                </input>
                                <button onClick={handleSetDoneIsEditingNick}>Save</button>
                                </>
                                :
                                <div className={"text-gray-800 -mt-1"} onClick={handleSetIsEditingNick}>{accountDetailsProps.nickname}</div>
                        }
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



