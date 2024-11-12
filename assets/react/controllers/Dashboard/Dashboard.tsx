import React, {useEffect, useState} from 'react';
import Navbar from "../Navbar/Navbar";
import DashboardGrid from "../Dashboard/DashboardGrid";
import DashboardGridElement from "../Dashboard/DashboardGridElement";
import NavbarHelper from "../Navbar/NavbarHelper";
import DashboardGridAddElement from "../Dashboard/DashboardGridAddElement";
import AddPlaneModal, { NewPlaneData } from "./AddPlaneModal";
import PlaneDetails from "./PlaneDetails/PlaneDetails";
import axios from 'axios';

interface DashboardProps {
    initialPlanes: PlaneData[];
}

const Dashboard: React.FC<DashboardProps> = ({ initialPlanes }) => {
    const [planes, setPlanes] = useState<PlaneData[]>(initialPlanes);
    const [planeAddModalVisible, setPlaneAddModalVisible] = useState<boolean>(false);
    const [planeDetailData, setPlaneDetailData] = useState<PlaneData | null>(null);

    useEffect(() => {
        console.log(initialPlanes);
        const loadPlaneImages = async () => {
            const updatedPlanes = await Promise.all(
                planes.map(async (plane) => {
                    try {
                        const response = await axios.get(`/api/planes/plane-image/${plane.id}/medium`);
                        return {
                            ...plane,
                            imageSrc: response.data.imageExists ? response.data.imageUrl : null,
                            hasImage: response.data.imageExists,
                            imageError: null
                        };
                    } catch (error) {
                        console.error('Error fetching plane image:', error);
                        return {
                            ...plane,
                            imageSrc: null,
                            hasImage: false,
                            imageError: 'Failed to load plane image'
                        };
                    }
                })
            );
            setPlanes(updatedPlanes);
        };

        loadPlaneImages();
    }, []);
    function addPlaneClicked() {
        setPlaneAddModalVisible(true);
    }

    function planeDetailClicked(planeData: PlaneData) {
        setPlaneDetailData(planeData);
    }

    function planeDetailClosed() {
        setPlaneDetailData(null);
    }

    async function saveNewPlane(newPlaneData: NewPlaneData) {
        try {
            const response = await axios.post<PlaneData>('/api/planes', newPlaneData, {
                withCredentials: true
            });
            if (response.status === 201) {
                setPlanes(prevPlanes => [...prevPlanes, response.data]);
                successfulPlaneAdd();
            } else {
                errorPlaneAdd();
            }
        } catch (error) {
            console.error('Error adding new plane:', error);
            errorPlaneAdd();
        }
    }

    function successfulPlaneAdd() {
        console.log("Successfully added a new plane!");
        closeModal();
    }

    function errorPlaneAdd() {
        alert("Error adding a new plane. Please try again later.");
    }

    function closeModal() {
        setPlaneAddModalVisible(false);
    }

    const planeGridElements = planes.map((planeData, index) => (
        <DashboardGridElement key={planeData.id} planeData={planeData} planeClicked={planeDetailClicked} />
    ));
    planeGridElements.push(
        <DashboardGridAddElement key="add-new" addText="Add new" addClicked={addPlaneClicked} />
    );

    return (
        <>
            <div className="h-full w-full">
                { planeDetailData ? (
                    <PlaneDetails planeData={planeDetailData} exitDetails={planeDetailClosed}/>
                ) : (
                    <div className="px-16 mt-8">
                        <DashboardGrid gridElements={planeGridElements} gridTitle="Your Planes"/>
                    </div>
                )}
            </div>
            { planeAddModalVisible && !planeDetailData ? (
                <AddPlaneModal closeModal={closeModal} savePlane={saveNewPlane} />
            ) : null }
        </>
    );
};

export interface PlaneData {
    id: number;
    friendly_name: string;
    tail: string;
    active: boolean;
    serial: string;
    icao: string;
    model: string;
    typeName: string;
    regowner: string;
    hours: number;
    plane_data: any;
    owner: number | null;
    cover_file: string;
    mileage: number;
    lastLogDate: string;
    createdAt: string;
    updatedAt: string;
    imageSrc?: string | null;
    imageError?: string | null;
    hasImage?: boolean | null;
}

export default Dashboard;
