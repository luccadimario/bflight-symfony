import React, {useEffect, useState} from 'react';

const AddMlogModal: React.FC<AddMlogModalProps> = (props) => {

    const [changesMade, setChangesMade] = useState<boolean>(false);
    const [maintenanceLogName, setMaintenanceLogName] = useState<string>("");
    const [maintenanceLogDescription, setMaintenanceLogDescription] = useState<string>('')

    useEffect(() => {
        const handleEscape = (event) => {
            if(event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function closeModal() {
        if (changesMade) {
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                props.closeModal();
            } else {
                return;
            }
        }
        props.closeModal();
    }

    function handleSave() {
        const newPlaneData: NewMlogData = {
            mlogName: maintenanceLogName,
            mlogDescription: maintenanceLogDescription
        }
        props.savePlane(newPlaneData);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[999] flex justify-center items-center">
            <div
                className="bg-white py-2 bg-opacity-90 rounded-2xl shadow-lg w-full md:w-3/4 lg:w-1/2 h-5/6 overflow-y-auto md:overflow-none md:h-auto flex flex-col justify-between">
                <div className="w-full flex justify-between pt-6 px-6">
                    {/* Top Left Element */}
                    <div className="self-start">
                        <div className={"cursor-pointer hover:scale-125 transition-transform ease-in-out duration-200"}
                             onClick={closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                        </div>
                    </div>

                    {/* Top Right Element */}
                    <div className="self-start text-right">
                        <div className={"hidden"}></div>
                    </div>
                </div>

                {/* Centered elements */}
                <div className="px-6 my-4 md:h-36">
                    <div className={"text-xl font-bold mb-2 mt-4 md:mt-0"}>Add New Maintenance Log</div>
                    <div className="font-bold text-gray-600 text-xs mt-2">MAINTENANCE LOG NAME</div>
                    <input type="text"
                           className={"w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none" + (isBlank(maintenanceLogName) ? " bg-transparent" : " !bg-white")}
                           placeholder="Airframe" value={maintenanceLogName} onChange={handleMlogNameChange}/>
                    <div className="font-bold text-gray-600 text-xs mt-2">MAINTENANCE LOG DESCRIPTION</div>
                    <input type="text"
                           className={"w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none" + (isBlank(maintenanceLogName) ? " bg-transparent" : " !bg-white")}
                           placeholder="Description" value={maintenanceLogDescription} onChange={handleMlogDescriptionChange}/>
                </div>

                <div className="w-full pb-6 px-6">
                    <div className="self-end text-right">
                        <button
                            className="bg-green-500 bg-opacity-70 hover:bg-opacity-100 hover:scale-105 transition-all duration-200 ease-in-out text-white font-bold py-1 px-4 rounded-full float-right"
                            onClick={handleSave}>Save & Add!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    function isBlank(str: string) {
        return (!str || /^\s*$/.test(str));
    }

    function handleMlogNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setMaintenanceLogName(event.target.value);
        setChangesMade(true);
    }
    function handleMlogDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
        setMaintenanceLogDescription(event.target.value);
        setChangesMade(true);
    }
};

export interface NewMlogData {
    mlogName: string;
    mlogDescription: string;
}

interface AddMlogModalProps {
    closeModal: () => void,
    savePlane: (arg0: NewMlogData) => void,
}

export default AddMlogModal;