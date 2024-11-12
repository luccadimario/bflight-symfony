import React, {useEffect, useState} from "react"
import {FileObject} from "../FileUpload/FileUpload";



export default function FileView() {
    const [file, setFile] = useState<FileObject | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        //pull file id
        console.log(loading);
        const newFileObject: FileObject  = {
            //guikey: "4",
            filename: "FILE",
            //b64:"hello",
            type: "image",
            //preview: "https://127.0.0.1:8000/images/logbook.jpg"
        }
        setFile(newFileObject);
        setLoading(false)
        console.log(loading);
    }, []);


    return(
        <>
            <div className={"container min-h-full drop-shadow-2xl w-1/2 p-2"}>
            {!loading ? (
            <div className={"overflow-hidden"}>
                {file.type === "image" ?/*&& file.preview &&*/ (
                    <img
                        className="rounded-2xl m-auto w-full flex text-center p-2"
                        draggable="false"
                        src={""}
                        alt={file.filename}
                    />
                ): null}
                {file.type === "pdf" ?/*&& file.preview &&*/ (
                    <iframe
                        src={"file.preview"}>

                    </iframe>
                ): null}
            </div>
            ) : (
                <p>Loading...</p>
            )

            }
            </div>
        </>
    )
}
