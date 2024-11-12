import React, {useEffect, useRef, useState} from "react";
import { Progress } from "@material-tailwind/react";
import { makeAuthCall } from "../AuthManager/AuthManager";
import axios from "axios";

export default function Queue(props: {
    listItems: queueItem[];
    setListItems: React.Dispatch<React.SetStateAction<queueItem[]>>;
}) {
    const [listItemsHTML, setListItemsHTML] = useState<React.JSX.Element[] | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [processedItems, setProcessedItems] = useState<queueItem[]>([]);


    function blobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
        return new Promise((resolve, _) => {
            try {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            } catch (e) {
                console.log(e);
            }
        });
    }

    const sendDataToServer = async (data: Blob, queueItem: queueItem) => {
        try {
            let url = "https://api.boundlessflight.net/api/ocr";
            let dataURL: string | ArrayBuffer = await blobToBase64(data);
            dataURL = String(dataURL).split(",")[1];
            /*let response = await axios.post(
                "https://api.boundlessflight.net/api/ocr",
                {
                    blob: dataURL,
                    handwritten: "True",
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );*/
            const response = await makeAuthCall(url, "POST", {blob: dataURL, handwritten: "True"});
            console.log("Data sent successfully!");
            queueItem.text = response.data;
            setProcessedItems((prevItems) => [...prevItems, queueItem]);
        } catch (error) {
            console.error("Error sending data to server:", error);
        }
    };

    useEffect(() => {
        const list = props.listItems.map((queueElement) => (
            <li key={queueElement.id}>
                <h1 className="text-gray-600 font-semibold">{"Item " + queueElement.id}</h1>
            </li>
        ));
        setListItemsHTML(list);
    }, [props.listItems]);

    const handleItemClick = (queueElement: queueItem) => {
        if (queueElement.text !== null) {
            alert(queueElement.text);
        }
    };

    useEffect(() => {
        if (props.listItems.length > 0 && !isSending) {
            setIsSending(true);
            const dataToSend = props.listItems[0].blob;
            sendDataToServer(dataToSend, props.listItems[0])
                .then(() => {
                    props.setListItems((prevQueue) => prevQueue.slice(1));
                })
                .catch((error) => {
                    console.error("Error sending data:", error);
                })
                .finally(() => {
                    setIsSending(false);
                });
        }
    }, [props.listItems, isSending]);

    return (
        <div className={"border-2 rounded-xl border-gray-200"}>
            <div className={"w-24 h-max border-gray-200 rounded-xl ring-gray-200 ring-1 hover:cursor-progress"}>
                <ul>
                    {listItemsHTML}
                </ul>
            </div>
            <div
                className={"w-24 h-max border-gray-200 ring-gray-200 ring-1 rounded-xl bg-green-500 hover:cursor-pointer"}>
                <ul>
                    {processedItems.map((queueElement) => (
                        <li key={queueElement.id} onClick={() => handleItemClick(queueElement)}>
                            <h1 className="text-gray-600 font-semibold">{"Item " + queueElement.id}</h1>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export interface queueItem {
    blob: Blob;
    text: string | null;
    id: number;
}
