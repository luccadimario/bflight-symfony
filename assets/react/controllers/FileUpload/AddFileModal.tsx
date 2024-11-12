import React, { useEffect, useRef, useState } from 'react';
import { FileObject } from './FileUpload';

const AddFileModal: React.FC<AddFileModalProps> = (props) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (props.changesMade) {
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                props.closeModal();
            } else {
                return;
            }
        }
        props.closeModal();
    }

    function handleSave() {
        /*const newFileData: NewFileData[] = uploadedFiles.map(file => ({
            filename: file.name,
            file: file
        }));*/
        props.saveFiles(uploadedFiles);
        props.closeModal();
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setUploadedFiles(prevFiles => [...prevFiles, ...filesArray]);
            props.setChangesMade(true);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="px-6 flex-grow flex flex-col">
                <div className="text-xl font-bold mb-2 mt-4 md:mt-0">Add New File(s)</div>
                <div className="flex-grow flex flex-col">
                    <div className="mb-4 flex flex-grow justify-center items-center">
                        <button
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose File
                        </button>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    {uploadedFiles.length >= 1 ?
                    <div className="flex-grow overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2 flex justify-between items-center">
                                <span>{file.name}</span>
                                <button
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                    onClick={() => {
                                        setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
                                        props.setChangesMade(true);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div> : null}
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="w-full text-right">
                    <button
                        className="bg-green-500 bg-opacity-70 hover:bg-opacity-100 hover:scale-105 transition-all duration-200 ease-in-out text-white font-bold py-1 px-4 rounded-full"
                        onClick={handleSave}
                    >
                        Save & Add!
                    </button>
                </div>
            </div>
        </div>
    );


    function isBlank(str: string) {
        return (!str || /^\s*$/.test(str));
    }
};

export interface NewFileData {
    filename: string;
    file: File | null;
}

interface AddFileModalProps {
    closeModal: () => void;
    saveFiles: (files: File[]) => void;
    changesMade: boolean;
    setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
}

export default AddFileModal;
