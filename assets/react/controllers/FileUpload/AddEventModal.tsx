import React, { useEffect, useState } from 'react';
import { FileObject } from './FileUpload';


const AddEventModal: React.FC<AddEventModalProps> = (props) => {
    const [changesMade, setChangesMade] = useState<boolean>(false);
    const [eventName, setEventName] = useState<string>("");
    const [eventCategory, setEventCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>(""); // New state for date
    const [mechCert, setMechCert] = useState<FileObject | null>(null);
    const [digitalSignature, setDigitalSignature] = useState<string>("");

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
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
        const newEventData: NewEventData = {
            eventName,
            eventCategory,
            description,
            eventDate: eventDate || new Date().toISOString().split('T')[0],
            mechCert,
            digitalSignature
        };
        props.saveEvent(newEventData);
        props.closeModal();
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const newMechCertObject: FileObject = {
                filename: file.name,
                type: file.type,
                file: file
            };
            setMechCert(newMechCertObject);
            setChangesMade(true);
        }
    }

    return (
        <div>
            <div className="px-6 my-4 md:h-auto">
                <div className="text-xl font-bold mb-2 mt-4 md:mt-0">Add New Event</div>

                <div className="font-bold text-gray-600 text-xs mt-2">EVENT NAME</div>
                <input type="text"
                       className={`w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none ${isBlank(eventName) ? "bg-transparent" : "!bg-white"}`}
                       placeholder="Event Name" value={eventName} onChange={(e) => { setEventName(e.target.value); setChangesMade(true);  }}/>

                <div className="font-bold text-gray-600 text-xs mt-2">EVENT CATEGORY</div>
                <input type="text"
                       className={`w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none ${isBlank(eventCategory) ? "bg-transparent" : "!bg-white"}`}
                       placeholder="Event Category" value={eventCategory} onChange={(e) => { setEventCategory(e.target.value); setChangesMade(true); }}/>

                <div className="font-bold text-gray-600 text-xs mt-2">EVENT DATE</div>
                <input type="date"
                       className={`w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none ${isBlank(eventDate) ? "bg-transparent" : "!bg-white"}`}
                       value={eventDate}
                       onChange={(e) => { setEventDate(e.target.value); setChangesMade(true); console.log(e.target.value)}}/>

                <div className="font-bold text-gray-600 text-xs mt-2">DESCRIPTION</div>
                <textarea
                    className={`w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none ${isBlank(description) ? "bg-transparent" : "!bg-white"}`}
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setChangesMade(true); }}
                    rows={4}
                />

                <div className="font-bold text-gray-600 text-xs mt-2">MECHANIC CERTIFICATE</div>
                <input type="file"
                       className="w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none"
                       onChange={handleFileChange}/>

                <div className="font-bold text-gray-600 text-xs mt-2">DIGITAL SIGNATURE</div>
                <input type="text"
                       className={`w-full p-1 rounded-lg focus:bg-gray-50 transition-colors ease-in-out duration-200 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none ${isBlank(digitalSignature) ? "bg-transparent" : "!bg-white"}`}
                       placeholder="Digital Signature" value={digitalSignature} onChange={(e) => { setDigitalSignature(e.target.value); setChangesMade(true); }}/>
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
    );

    function isBlank(str: string) {
        return (!str || /^\s*$/.test(str));
    }
};

export interface NewEventData {
    eventName: string;
    eventCategory: string;
    description: string;
    eventDate: string;
    mechCert: FileObject | null;
    digitalSignature: string;
}

interface AddEventModalProps {
    closeModal: () => void,
    saveEvent: (arg0: NewEventData) => void,
}

export default AddEventModal;
