import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { formatPlaneDate, PlaneDataDetailed } from "../../PlaneDetails";
import { makeAuthCall } from "../../../../AuthManager/AuthManager";
import { renderLastLogDate, renderMaintenanceDocuments, renderTailNumber } from "./MainInfoComponentView";

const MainInfoComponentEdit: React.FC<PlaneEditProps> = (props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [planeDetails, setPlaneDetails] = useState(props.planeDataDetailed);
    const [imageSrc, setImageSrc] = useState<string | null>(props.planeDataDetailed.imageSrc);
    const [imageError, setImageError] = useState<string | null>(props.planeDataDetailed.imageError);
    const [hasImage, setHasImage] = useState<boolean | null>(props.planeDataDetailed.hasImage)

    function saveEdits() {
        props.editingDone(planeDetails);
    }

    async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`/api/planes/upload-image/${props.planeDataDetailed.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImageSrc(response.data.paths.medium);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    const handlePlaneNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaneDetails(prevDetails => ({ ...prevDetails, friendly_name: event.target.value }));
    }

    const handlePlaneModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaneDetails(prevDetails => ({ ...prevDetails, model: event.target.value }));
    }

    const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaneDetails(prevDetails => ({ ...prevDetails, hours: parseFloat(event.target.value) }));
    }

    const handleMileageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaneDetails(prevDetails => ({ ...prevDetails, mileage: parseFloat(event.target.value) }));
    }

    const handleDeletePlaneClick = () => {
        let result = confirm("Are you sure you want to delete this plane?");
        if (result) {
            makeAuthCall(`/api/planes/${planeDetails.id}`, "DELETE", null)
                .then(() => {
                    alert("Plane deleted successfully!");
                    window.location.href = "/dashboard";
                }).catch((err) => {
                alert("Error deleting plane: " + err);
            });
        }
    }

    return (
        <>
            <div className="flex justify-between">
                <div className={"inline-block"}>
                    <input
                        className={"text-2xl rounded-lg outline-1 outline-gray-200 bg-gray-100 inline-block"}
                        type="text"
                        value={planeDetails.friendly_name || ''}
                        onChange={handlePlaneNameChange}
                        name="planeName">
                    </input>
                    <div
                        className={"bg-red-500 px-3 py-1 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform text-white inline-block ml-2"}
                        onClick={handleDeletePlaneClick}>
                        Delete Plane
                    </div>
                </div>
                <button onClick={saveEdits}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col flex-1 mt-2">
                <div className={"w-full h-96 cursor-pointer"} onClick={handleImageClick}>
                    {imageError ? (
                        <div className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
                            {imageError}
                        </div>
                    ) : !hasImage ? (
                        <div className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
                            No image uploaded. Click to upload an image.
                        </div>
                    ) : imageSrc ? (
                        <img src={imageSrc} alt="Plane Hero Image" className="w-full h-full rounded-2xl object-cover"/>
                    ) : (
                        <div className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    <input type={"file"} className={"hidden"} ref={fileInputRef} onChange={handleImageUpload}/>
                </div>
                <div className={"w-full flex"}>
                    <div className={"flex-1"}>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">TAIL NUMBER</div>
                            <div className={"text-gray-800 -mt-1"}>{renderTailNumber(props.planeDataDetailed)}</div>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">MODEL</div>
                            <input
                                className={"rounded-lg outline-none bg-gray-100 -mt-1"}
                                type="text"
                                value={planeDetails.model || ''}
                                onChange={handlePlaneModelChange}
                                name="planeModel">
                            </input>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">LAST LOG DATE</div>
                            <div className={"text-gray-800 -mt-1"}>{renderLastLogDate(props.planeDataDetailed)}</div>
                        </div>
                    </div>
                    <div className={"flex-1"}>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">MILEAGE</div>
                            <input
                                className={"rounded-lg outline-none bg-gray-100 -mt-1"}
                                type="number"
                                value={planeDetails.mileage || ''}
                                onChange={handleMileageChange}
                                name="mileage">
                            </input>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">HOURS</div>
                            <input
                                className={"rounded-lg outline-none bg-gray-100 -mt-1"}
                                type="number"
                                value={planeDetails.hours || ''}
                                onChange={handleHoursChange}
                                name="hours">
                            </input>
                        </div>
                        <div className={"mt-2"}>
                            <div className="font-extrabold text-sm text-gray-500">MAINTENANCE DOCUMENTS</div>
                            <div className={"text-gray-800 -mt-1"}>{renderMaintenanceDocuments(props.planeDataDetailed)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export interface PlaneEditProps {
    planeDataDetailed: PlaneDataDetailed;
    editingDone: (newPlaneDataDetailed: PlaneDataDetailed) => void;
}

export default MainInfoComponentEdit;
