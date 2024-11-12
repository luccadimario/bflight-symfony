import React, {useEffect, useState} from "react";
import FileView from "./FileView";
import OCRTextView from "./OCRTextView";

export default function OCREdit(props: {fileID: string}) {



    return (
        <div className={"flex overflow-hidden bg-gray-200 rounded-2xl drop-shadow-2xl m-2.5"}>
            <FileView/>
            <OCRTextView fileID={"1"}/>
        </div>
    )
}
