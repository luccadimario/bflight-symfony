import React, {useState} from 'react';
import MainInfoComponentView from "./MainInfoComponent/MainInfoComponentView";
import MainInfoComponentEdit from "./MainInfoComponent/MainInfoComponentEdit";
import {PlaneDetailGridProps} from "../PlaneDetailGrid";
import {PlaneDataDetailed} from "../PlaneDetails";

const MainInfoComponent: React.FC<MainInfoComponentProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    function handleEditingStart() {
        setIsEditing(true);
    }

    function handleEditingDone() {
        setIsEditing(false);
        //makeAuthCall()!!
    }

    return (
        <div className="rounded-2xl bg-gray-200 p-8 shadow-xl col-span-full md:col-span-8">
            {isEditing ? (
                <MainInfoComponentEdit planeDataDetailed={props.planeDataDetailed} editingDone={handleEditingDone} />
            ) : (
                <MainInfoComponentView planeDataDetailed={props.planeDataDetailed} editingStart={handleEditingStart}/>
            )}
        </div>
    );
};

export interface MainInfoComponentProps {
    planeDataDetailed: PlaneDataDetailed;
}

export default MainInfoComponent;