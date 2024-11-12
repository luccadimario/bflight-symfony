import React from 'react';
import Dropdown from './Dropdown'; // Adjust the import path as needed
import LazyLoadedPreview from '../ImageLoading/LazyLoadedPreview'; // Adjust the import path as needed
import { EventObject } from './FileUpload';

interface EventUploadObjectProps {
    guikey: string;
    item: EventObject;
    isDragging: boolean;
    deleteEntry: (guikey: string) => void;
    replaceEntry: (guikey: string) => void;
    insertFilesFront: (guikey: string) => void;
    insertFilesBehind: (guikey: string) => void;
    getPreviewUrl: (fileId: number) => string;
}

const EventUploadObject: React.FC<EventUploadObjectProps> = ({guikey, item, isDragging, deleteEntry, replaceEntry, insertFilesFront, insertFilesBehind, getPreviewUrl}) => {
    console.log(item.mechCert);
    return (
        <div key={guikey} className="bg-gray-200 rounded-2xl text-ellipsis border-2 border-green-400">
            <div className="grid-item-content relative w-full h-full">
                <div
                    className={`draggable-area absolute inset-0 z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                ></div>
                <div className="non-draggable absolute top-0 right-0 z-20">
                    <Dropdown
                        guikey={guikey}
                        onDelete={deleteEntry}
                        onReplace={replaceEntry}
                        onInsertFront={insertFilesFront}
                        onInsertBehind={insertFilesBehind}
                    />
                </div>
                <div className="file-content relative z-10 pointer-events-none select-none">
                    <div className="file-preview-container">
                        <div className="file-preview-content">
                            <LazyLoadedPreview
                                getPreviewUrl={getPreviewUrl}
                                fileId={item.mechCert.id}
                                filename={item.mechCert.filename}
                                type={item.mechCert.type}
                            />
                        </div>
                    </div>
                    <div className={"file-name-container"}>
                        <div className="file-name">{item.eventName}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventUploadObject;
