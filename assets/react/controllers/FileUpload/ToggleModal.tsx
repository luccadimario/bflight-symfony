import React, { useEffect, useRef, useState } from 'react';
import AddEventModal, { NewEventData } from './AddEventModal';
import AddFileModal, { NewFileData } from './AddFileModal';
import { FileObject } from "./FileUpload";
import FancySelectionButton from "./FancySelectionButton";

const ToggleModal: React.FC<ToggleModalProps> = (props) => {
    const [selectedModal, setSelectedModal] = useState<'event' | 'file'>('event');
    const [contentHeight, setContentHeight] = useState<number>(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const [changesMade, setChangesMade] = useState<boolean>(false);
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [selectedModal]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[999] flex items-center justify-center">
            <div
                className="bg-white py-2 bg-opacity-90 rounded-2xl shadow-lg w-full md:w-3/4 lg:w-1/2 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                style={{ maxHeight: '90vh', height: contentHeight }}
            >
                <div className="w-full flex justify-between pt-6 px-6">
                    <div className="flex items-center space-x-4 w-full">
                        <div className="cursor-pointer hover:scale-125 transition-transform ease-in-out duration-200"
                             onClick={props.closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center rounded-2xl">
                    <FancySelectionButton className={"flex"} onSelect={setSelectedModal} />
                </div>
                <div ref={contentRef} className="flex-grow px-6 my-4 overflow-y-auto">
                    {selectedModal === "event" ?
                        (<AddEventModal closeModal={props.closeModal} saveEvent={props.saveEvent} />) :
                        (<AddFileModal changesMade={changesMade} setChangesMade={setChangesMade} closeModal={props.closeModal} saveFiles={props.saveFiles} />)
                    }
                </div>
            </div>
        </div>
    );
};

interface ToggleModalProps {
    closeModal: () => void;
    saveEvent: (arg0: NewEventData) => void;
    saveFiles: (arg0: File[]) => void;
    fileObject: FileObject;
    fileInputRef: React.RefObject<HTMLInputElement>
}

export default ToggleModal;
