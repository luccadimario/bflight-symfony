import React from 'react';
import {PlaneData} from "./Dashboard";

const DashboardGridElement: React.FC<DashboardGridElementProps> = (props) => {

    function handlePlaneClicked() {
        props.planeClicked(props.planeData);
    }

    return (
        <div className="col-span-full md:col-span-1 w-full flex-grow">
            <div
                onClick={handlePlaneClicked}
                className="bg-gray-50 px-1 pt-1 pb-1 drop-shadow-lg shadow-lg rounded-2xl flex flex-col items-center transition-transform hover:scale-105 duration-300 ease-in-out cursor-pointer"
            >
                <div className="h-32 w-full relative">
                    {props.planeData.imageError ? (
                        <div
                            className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
                            {props.planeData.imageError}
                        </div>
                    ) : !props.planeData.hasImage ? (
                        <div
                            className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
                            No image uploaded. Click to upload an image.
                        </div>
                    ) : props.planeData.imageSrc ? (
                        <img
                            src={props.planeData.imageSrc}
                            alt="Plane Hero Image"
                            className="w-full h-full rounded-2xl object-cover"
                        />
                    ) : (
                        <div className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
                <div className="text-center text-lg mt-1 drop-shadow-xl">{props.planeData.friendly_name}</div>
            </div>
        </div>
    );
};

interface DashboardGridElementProps {
    planeData: PlaneData;
    planeClicked: (arg0: PlaneData) => void;
}

export default DashboardGridElement;