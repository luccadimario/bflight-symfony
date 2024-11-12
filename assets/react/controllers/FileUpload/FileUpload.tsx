import React, { useCallback, useEffect, useRef, useState } from "react";
import "./FileObj.css";
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { compact } from 'react-grid-layout/build/utils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
import AddMlogModal, { NewMlogData } from "./AddMlogModal";
import { PlaneData } from "../Dashboard/Dashboard";
import axios from "axios";
import { debounce } from 'lodash';
import FileUploadObject from "./FileUploadObject";
import EventUploadObject from "./EventUploadObject";
import ToggleModal from "./ToggleModal";
import {NewFileData} from "./AddFileModal";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface MaintenanceLog {
    id: number;
    name: string;
    description?: string;
    date: string;
    mlogEntries: MlogEntry[];
    layout?: string;
}

export interface MlogEntry {
    id: number;
    guikey: string;
    type: 'file' | 'event';
    fileRelation?: FileObject;
    eventRelation?: EventObject;
}

export interface FileObject {
    id?: number;
    filename: string;
    type?: string;
    file?: File;
}

export interface EventObject {
    id?: number;
    eventName: string;
    eventCategory: string;
    description: string;
    eventDate: string;
    mechCert: FileObject;
    digitalSignature: string;
}

export default function FileUpload(props: { planeData: PlaneData, initialMaintenanceLogs: MaintenanceLog[] }) {
    const [plane] = useState<PlaneData>(props.planeData);
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
        console.log(props.initialMaintenanceLogs);
        return props.initialMaintenanceLogs.map(log => ({
            ...log,
            mlogEntries: log.mlogEntries.map(entry => ({
                ...entry,
                guikey: entry.guikey || uuidv4()
            }))
        }));
    });

    const [selectedMaintenanceLogIndex, setSelectedMaintenanceLogIndex] = useState<number>(0);
    const [mlogLoading, setMlogLoading] = useState<boolean>(false);
    const [mlogAddModalVisible, setMlogAddModalVisible] = useState<boolean>(false);
    const [toggleModalVisible, setToggleModalVisible] = useState<boolean>(false);
    const [keyToEdit, setKeyToEdit] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const hiddenFileInputMultiple = useRef<HTMLInputElement>(null);
    const hiddenFileInputReplace = useRef<HTMLInputElement>(null);
    const hiddenFileInputInsertFront = useRef<HTMLInputElement>(null);
    const hiddenFileInputInsertBehind = useRef<HTMLInputElement>(null);

    const [layouts, setLayouts] = useState<{ [key: number]: Layout[] }>(() => {
        const initialLayouts: { [key: number]: Layout[] } = {};
        props.initialMaintenanceLogs.forEach((log) => {
            if (log.layout) {
                initialLayouts[log.id] = JSON.parse(log.layout);
            } else {
                initialLayouts[log.id] = log.mlogEntries.map((entry, index) => ({
                    i: entry.guikey,
                    x: index % 6,
                    y: Math.floor(index / 6),
                    w: 1,
                    h: 1
                }));
            }
        });
        return initialLayouts;
    });

    const getPreviewUrl = (fileId: number) => {
        return `/serve-previews/${encodeURIComponent(fileId)}`;
    };

    const debouncedSaveToLocalStorage = useCallback(
        debounce((newLayout) => {
            localStorage.setItem(`layout_${maintenanceLogs[selectedMaintenanceLogIndex].id}`, JSON.stringify(newLayout));
            setUnsavedChanges(true);
        }, 1000),
        [maintenanceLogs, selectedMaintenanceLogIndex]
    );

    useEffect(() => {
        console.log("Current layouts:", props.initialMaintenanceLogs);

        if (maintenanceLogs.length === 0) {
            setMlogAddModalVisible(true);
        }
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [maintenanceLogs, unsavedChanges, layouts]);

    const isAllowedFileType = (file: File): boolean => {
        return file.type.startsWith('image/') || file.type === 'application/pdf';
    };

    const onLayoutChange = (currentLayout: Layout[]) => {
        console.log("Layout change:", currentLayout);
        const compactedLayout = compact(currentLayout, 'horizontal', 6);
        setLayouts(prevLayouts => ({
            ...prevLayouts,
            [maintenanceLogs[selectedMaintenanceLogIndex].id]: compactedLayout
        }));
        debouncedSaveToLocalStorage(compactedLayout);
    };

    const saveLayoutToDatabase = async () => {
        try {
            await axios.post('/api/save-layout', {
                mlogId: maintenanceLogs[selectedMaintenanceLogIndex].id,
                layout: layouts[maintenanceLogs[selectedMaintenanceLogIndex].id]
            });
            setUnsavedChanges(false);
            alert('Layout saved successfully!');
        } catch (error) {
            console.error('Error saving layout to database:', error);
            alert('Failed to save layout. Please try again.');
        }
    };

    const handleEventUpload = async(eventData: EventObject, mlogId: number) => {
        console.log("Here1");
        console.log(eventData);
        try {
            if(eventData.mechCert.file) {
                if(!isAllowedFileType(eventData.mechCert.file)) {
                    throw new Error('Unsupported file type. Only images and PDFs are allowed.');
                }
                const formData = new FormData();

                // Append text data
                formData.append('eventName', eventData.eventName);
                formData.append('eventCategory', eventData.eventCategory);
                formData.append('description', eventData.description);
                formData.append('eventDate', eventData.eventDate);
                formData.append('digitalSignature', eventData.digitalSignature);
                formData.append('mechCert', eventData.mechCert.file);

                const response = await axios.post(`/api/mlog/${mlogId}/add-event`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 201) {
                    const newMlogEntry: MlogEntry = {
                        id: response.data.id,
                        guikey: response.data.guikey,
                        type: 'event',
                        eventRelation: {
                            id: response.data.event.id,
                            eventName: response.data.event.name,
                            eventCategory: response.data.event.category,
                            eventDate: response.data.event.date,
                            description: response.data.event.description,
                            mechCert: {
                                id: response.data.event.mechCert.id,
                                filename: response.data.event.mechCert.filename,
                                type: response.data.event.mechCert.type,
                            },
                            digitalSignature: response.data.event.signature,
                        }
                    };

                    setMaintenanceLogs(prevLogs => {
                        const updatedLogs = [...prevLogs];
                        const logIndex = updatedLogs.findIndex(log => log.id === mlogId);
                        if (logIndex !== -1) {
                            updatedLogs[logIndex].mlogEntries.push(newMlogEntry);
                        }
                        return updatedLogs;
                    });

                    updateLayoutWithNewEntry(newMlogEntry, mlogId);

                    return newMlogEntry;
                } else {
                    throw new Error('File upload failed');
                }

            }
            else {
                throw new Error('File does not exist within MechCertObject');
            }
        } catch(e) {
            console.error("Error uploading file:", e);
            alert(e instanceof Error ? e.message : "Failed to upload file. Please try again.");
            throw e;
        }

    }

    const uploadFile = async (file: File, mlogId: number): Promise<MlogEntry> => {
        try {
            if (!isAllowedFileType(file)) {
                throw new Error('Unsupported file type. Only images and PDFs are allowed.');
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`/api/mlog/${mlogId}/add-file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                const newMlogEntry: MlogEntry = {
                    id: response.data.id,
                    guikey: response.data.guikey,
                    type: 'file',
                    fileRelation: {
                        id: response.data.id,
                        filename: response.data.filename,
                        type: response.data.type,
                    }
                };


                setMaintenanceLogs(prevLogs => {
                    const updatedLogs = [...prevLogs];
                    const logIndex = updatedLogs.findIndex(log => log.id === mlogId);
                    if (logIndex !== -1) {
                        updatedLogs[logIndex].mlogEntries.push(newMlogEntry);
                    }
                    return updatedLogs;
                });

                updateLayoutWithNewEntry(newMlogEntry, mlogId);

                return newMlogEntry;
            } else {
                throw new Error('File upload failed');
            }
        } catch (e) {
            console.error("Error uploading file:", e);
            alert(e instanceof Error ? e.message : "Failed to upload file. Please try again.");
            throw e;
        }
    };

    const handleFileChangeMultiple = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (maintenanceLogs.length === 0) {
            alert("Please add a maintenance log first before uploading files.");
            return;
        }

        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const currentMlogId = maintenanceLogs[selectedMaintenanceLogIndex].id;
            const allowedFiles = Array.from(fileList).filter(isAllowedFileType);

            if (allowedFiles.length !== fileList.length) {
                alert("Some files were not uploaded because they are not supported. Only images and PDFs are allowed.");
            }

            allowedFiles.forEach(async (file) => {
                try {
                    await uploadFile(file, currentMlogId);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            });
        }
    };

    const handleFileChangeMultipleFileArray = (fileList: File[]) => {
        if (maintenanceLogs.length === 0) {
            alert("Please add a maintenance log first before uploading files.");
            return;
        }

        if (fileList && fileList.length > 0) {
            const currentMlogId = maintenanceLogs[selectedMaintenanceLogIndex].id;
            const allowedFiles = Array.from(fileList).filter(isAllowedFileType);

            if (allowedFiles.length !== fileList.length) {
                alert("Some files were not uploaded because they are not supported. Only images and PDFs are allowed.");
            }

            allowedFiles.forEach(async (file) => {
                try {
                    await uploadFile(file, currentMlogId);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            });
        }
    };

    const updateLayoutWithNewEntry = (newEntry: MlogEntry, mlogId: number) => {
        setLayouts(prevLayouts => {
            const currentLayout = prevLayouts[mlogId] || [];
            const newItem = {
                i: newEntry.guikey,
                x: currentLayout.length,
                y: 0,
                w: 1,
                h: 1
            };
            return {
                ...prevLayouts,
                [mlogId]: compact([...currentLayout, newItem], 'horizontal', 6)
            };
        });
    };

    const deleteEntry = (guikey: string) => {
        const currentMlogId = maintenanceLogs[selectedMaintenanceLogIndex].id;
        setMaintenanceLogs(prevLogs => {
            const updatedLogs = [...prevLogs];
            const logIndex = selectedMaintenanceLogIndex;
            updatedLogs[logIndex].mlogEntries = updatedLogs[logIndex].mlogEntries.filter(entry => entry.guikey !== guikey);
            return updatedLogs;
        });

        setLayouts(prevLayouts => ({
            ...prevLayouts,
            [currentMlogId]: compact(prevLayouts[currentMlogId].filter(item => item.i !== guikey), 'horizontal', 6)
        }));
    };

    const replaceFile = (guikey: string) => {
        setKeyToEdit(guikey);
        hiddenFileInputReplace.current?.click();
    };

    const insertFilesFront = (guikey: string) => {
        setKeyToEdit(guikey);
        hiddenFileInputInsertFront.current?.click();
    };

    const insertFilesBehind = (guikey: string) => {
        setKeyToEdit(guikey);
        hiddenFileInputInsertBehind.current?.click();
    };

    const handleFileReplace = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0 && keyToEdit) {
            const file = fileList[0];
            const currentMlogId = maintenanceLogs[selectedMaintenanceLogIndex].id;
            const newEntry = await uploadFile(file, currentMlogId);

            setMaintenanceLogs(prevLogs => {
                const updatedLogs = [...prevLogs];
                const logIndex = selectedMaintenanceLogIndex;
                const entryIndex = updatedLogs[logIndex].mlogEntries.findIndex(e => e.guikey === keyToEdit);
                if (entryIndex !== -1) {
                    updatedLogs[logIndex].mlogEntries[entryIndex] = newEntry;
                }
                return updatedLogs;
            });

            setLayouts(prevLayouts => {
                const updatedLayout = prevLayouts[currentMlogId].map(item =>
                    item.i === keyToEdit ? { ...item, i: newEntry.guikey } : item
                );
                return {
                    ...prevLayouts,
                    [currentMlogId]: compact(updatedLayout, 'horizontal', 6)
                };
            });

            setKeyToEdit(null);
        }
    };

    const handleFileInsert = async (event: React.ChangeEvent<HTMLInputElement>, insertBehind: boolean) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0 && keyToEdit) {
            const file = fileList[0];
            const currentMlogId = maintenanceLogs[selectedMaintenanceLogIndex].id;
            const newEntry = await uploadFile(file, currentMlogId);

            setMaintenanceLogs(prevLogs => {
                const updatedLogs = [...prevLogs];
                const logIndex = selectedMaintenanceLogIndex;
                const entryIndex = updatedLogs[logIndex].mlogEntries.findIndex(e => e.guikey === keyToEdit);
                if (entryIndex !== -1) {
                    updatedLogs[logIndex].mlogEntries.splice(insertBehind ? entryIndex + 1 : entryIndex, 0, newEntry);
                }
                return updatedLogs;
            });

            setLayouts(prevLayouts => {
                const currentLayout = prevLayouts[currentMlogId];
                const itemIndex = currentLayout.findIndex(item => item.i === keyToEdit);
                if (itemIndex !== -1) {
                    const newItem = {
                        i: newEntry.guikey,
                        x: insertBehind ? itemIndex + 1 : itemIndex,
                        y: 0,
                        w: 1,
                        h: 1
                    };
                    const updatedLayout = [...currentLayout];
                    updatedLayout.splice(insertBehind ? itemIndex + 1 : itemIndex, 0, newItem);
                    return {
                        ...prevLayouts,
                        [currentMlogId]: compact(updatedLayout, 'horizontal', 6)
                    };
                }
                return prevLayouts;
            });

            setKeyToEdit(null);
        }
    };

    const saveNewMlog = async (newMlogData: NewMlogData) => {
        try {
            const response = await axios.post(`/api/mlog/create/${plane.id}`, {
                name: newMlogData.mlogName,
                description: newMlogData.mlogDescription
            });
            if (response.status === 201) {
                const newLog: MaintenanceLog = {
                    id: response.data.id,
                    name: response.data.name,
                    description: response.data.description,
                    date: response.data.date,
                    mlogEntries: []
                };
                setMaintenanceLogs(prevLogs => [...prevLogs, newLog]);
                setSelectedMaintenanceLogIndex(maintenanceLogs.length);
                setLayouts(prevLayouts => ({
                    ...prevLayouts,
                    [newLog.id]: []
                }));
                setMlogAddModalVisible(false);
            }
        } catch (e) {
            console.error("Error creating new maintenance log:", e);
            alert("Failed to create new maintenance log. Please try again.");
        }
    };

    const goToPrevLog = () => {
        setSelectedMaintenanceLogIndex(prevIndex => (prevIndex === 0 ? maintenanceLogs.length - 1 : prevIndex - 1));
    };

    const goToNextLog = () => {
        setSelectedMaintenanceLogIndex(prevIndex => (prevIndex === maintenanceLogs.length - 1 ? 0 : prevIndex + 1));
    };

    const saveEvent = (newEvent: EventObject) => {
        handleEventUpload(newEvent, maintenanceLogs[selectedMaintenanceLogIndex].id);
    }

    const saveFile = (newFiles: File[]) => {
        handleFileChangeMultipleFileArray(newFiles);
    }

    return (
        <>
            <div className="pt-12 font-sans text-center bg-gray-200 rounded-2xl shadow-xl">
                <div className={"pt-4"}>
                    <button className="inline" onClick={goToPrevLog}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
                        </svg>
                    </button>
                    <h1 className={"inline px-16 text-3xl"}>{maintenanceLogs[selectedMaintenanceLogIndex]?.name || "No logs"}</h1>
                    <button className="inline" onClick={goToNextLog}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                        </svg>
                    </button>
                </div>
                <div>
                    <div onClick={() => setToggleModalVisible(true)} // Show ToggleModal instead of file input click
                         className={"h-16 pt-4 w-full m-auto rounded-xl bg-gray-200 hover:cursor-pointer"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChangeMultiple}
                        ref={hiddenFileInputMultiple}
                        style={{display: 'none'}}
                    />
                </div>
                {maintenanceLogs.length > 0 ? (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{lg: layouts[maintenanceLogs[selectedMaintenanceLogIndex].id] || []}}
                        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                        cols={{lg: 6, md: 4, sm: 2, xs: 1, xxs: 1}}
                        rowHeight={250}
                        onLayoutChange={onLayoutChange}
                        isDraggable={!mlogLoading}
                        isResizable={false}
                        compactType="horizontal"
                        preventCollision={false}
                        draggableHandle=".draggable-area"
                        onDragStart={() => setIsDragging(true)}
                        onDragStop={() => setIsDragging(false)}
                        width={1200}
                    >
                        {maintenanceLogs[selectedMaintenanceLogIndex]?.mlogEntries.map((item) => (
                            <div key={item.guikey}>
                                {item.type === 'file' ? (
                                    <FileUploadObject
                                        guikey={item.guikey}
                                        item={item.fileRelation}
                                        isDragging={isDragging}
                                        deleteFile={deleteEntry}
                                        replaceFile={replaceFile}
                                        insertFilesFront={insertFilesFront}
                                        insertFilesBehind={insertFilesBehind}
                                        getPreviewUrl={getPreviewUrl}
                                    />
                                ) : (
                                    <EventUploadObject
                                        guikey={item.guikey}
                                        item={item.eventRelation}
                                        isDragging={isDragging}
                                        deleteEntry={deleteEntry}
                                        replaceEntry={replaceFile}
                                        insertFilesFront={insertFilesFront}
                                        insertFilesBehind={insertFilesBehind}
                                        getPreviewUrl={getPreviewUrl}
                                    />
                                )}
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                ) : (
                    <div className="text-center py-8">
                        <p>No maintenance logs available. Add a new log to get started.</p>
                    </div>
                )}
            </div>
            <div className="mb-4 mt-4">
                <button
                    onClick={() => setMlogAddModalVisible(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New Log
                </button>
                <button
                    onClick={saveLayoutToDatabase}
                    disabled={!unsavedChanges}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ${!unsavedChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Save Layout
                </button>
            </div>
            {mlogAddModalVisible && (
                <AddMlogModal closeModal={() => setMlogAddModalVisible(false)} savePlane={saveNewMlog}/>
            )}
            {toggleModalVisible && (
                <ToggleModal
                    closeModal={() => setToggleModalVisible(false)}
                    saveEvent={saveEvent}
                    saveFiles={saveFile}
                    fileInputRef={hiddenFileInputMultiple}
                    fileObject={null} // Pass any necessary props here
                />
            )}
        </>
    );
}
