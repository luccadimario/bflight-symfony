import Spreadsheet from "react-spreadsheet";
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import {FileObject} from "../FileUpload/FileUpload";
import {makeAuthCall} from "../AuthManager/AuthManager";
import {PlaneDataDetailed} from "../Dashboard/PlaneDetails/PlaneDetails";
export default function LogSpreadsheet(props: {fileID: string} ) {
    const [file, setFile] = useState<FileObject>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        //pull file id
        const newFileObject: FileObject  = {
            //guikey: "4",
            filename: "FILE",
            //b64: "h",
            type: "image",
            //preview: "https://cdn.discordapp.com/attachments/1197629241114759268/1231766615255810098/Correct_Logbook_Example_B17B97253EA8A.jpg?ex=6638270e&is=6625b20e&hm=57b242194eaef7b8a856af2ecab9f825342c09d64b9615519186b528d45ad34a&"
        }
        setFile(newFileObject);
        setLoading(false);
    }, [props.fileID]);
    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }),[])
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState<rowDataInterface[]>([])
    const [colDefs, setColDefs] = useState([
        { field: "Date",
            suppressMovable: true,
            maxWidth: 350,
            minWidth: 100},
        { field: "Time in service",
            suppressMovable: true,
            maxWidth: 350,
            minWidth: 100},
        { field: "Time since overhaul",
            suppressMovable: true,
            maxWidth: 350,
            minWidth: 100},
        { field: "Tach time",
            suppressMovable: true,
            maxWidth: 350,
            minWidth: 100},
        { field: "Description",
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
            suppressMovable: true,
            flex: 2,
            minWidth: 200},
    ]);
    const [[showing, direction], setShowing] = useState([0, 0]);
    const screenDisplay = [
        (<div className={"flex items-center"}>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-50 cursor-pointer"
                 onClick={() => paginate(-1)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 my-auto"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                </svg>
            </div>
            <div className="inline flex-1 ag-theme-quartz max-h-max overflow-hidden" style={{height: '100vh'}}>
            {/* Container for the AgGridReact and buttons */}
                <button className="inline w-1/2 bg-gray-200 rounded-lg" onClick={addRow}>
                    Add Row
                </button>
                <button className="inline w-1/2 bg-gray-200 rounded-lg" onClick={removeRow}>
                    Delete Row
                </button>
                <AgGridReact
                    ref={gridRef}
                    rowSelection={'multiple'}
                    columnDefs={colDefs}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={printData}
                />
            </div>
        </div>),
        (<>
            <div className={"absolute inset-0 items-center justify-center"}>
                <div className={"inline bg-gray-200 rounded-xl"}>
                    {!loading ? (
                    <img src={""} alt={file.filename}
                         className={"mx-auto rounded-xl"}
                    />) : ( <p>Loading...</p>)}
                </div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer"
                     onClick={() => paginate(1)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 my-auto"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                    </svg>
                </div>
            </div>
        </>)
    ]
    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };
    const imageIndex = wrap(0, screenDisplay.length, showing);
    const paginate = (newDirection: number) => {
        setShowing([showing + newDirection, newDirection]);
    };

    function addRow() {
        const newItem = {}
        setRowData((prevRowData) => [...prevRowData, newItem]);
    }

    function removeRow() {
        if (gridRef.current) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            const selectedData = selectedNodes.map(node => node.data as rowDataInterface);

            // Filter out selected rows from rowData
            const updatedRowData = rowData.filter(rowDataInterface => !selectedData.includes(rowDataInterface));
            setRowData(updatedRowData);
        }
    }
    function printData() {
        console.log(rowData);
    }

    return (
        <>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={showing}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    dragListener={false}
                >
                    {screenDisplay[imageIndex]}
                </motion.div>
            </AnimatePresence>
        </>
    );
}
export interface rowDataInterface {
    date?: string | null,
    timeInService?: number | null,
    timeSinceOverhaul?: number | null,
    tachTime?: number | null,
    description?: string | null,
}