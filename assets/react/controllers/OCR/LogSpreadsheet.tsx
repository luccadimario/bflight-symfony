import Spreadsheet from "react-spreadsheet";
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import React from "react";
import {Button} from "@material-tailwind/react";
export default function LogSpreadsheet() {
    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }),[])
    const [rowData, setRowData] = useState<rowDataInterface[]>([])
    const [colDefs, setColDefs] = useState([
        { field: "Date",
            suppressMovable: true},
        { field: "Time in service",
            suppressMovable: true},
        { field: "Time since overhaul",
            suppressMovable: true},
        { field: "Tach time",
            suppressMovable: true},
        { field: "Description",
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
            suppressMovable: true},
    ]);
    const gridRef = useRef<AgGridReact>(null);
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

    return(
        <div className="flex-1 ag-theme-quartz max-h-max overflow-hidden" style={{ height: screen.height }}>
            <button className={"inline w-1/2 bg-gray-200 rounded-lg"} onClick={addRow} >Add Row</button>
            <button className={"inline w-1/2 bg-gray-200 rounded-lg"} onClick={removeRow}>Delete Row</button>
            <AgGridReact
                ref={gridRef}
                rowSelection={'multiple'}
                columnDefs={colDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                onCellValueChanged={printData}
            />
        </div>
    );
}
export interface rowDataInterface {
    date?: string | null,
    timeInService?: number | null,
    timeSinceOverhaul?: number | null,
    tachTime?: number | null,
    description?: string | null,
}