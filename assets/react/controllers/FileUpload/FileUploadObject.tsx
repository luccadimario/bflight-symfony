import React, {forwardRef} from 'react';
import Dropdown from './Dropdown'; // Adjust the import path as needed
import LazyLoadedPreview from '../ImageLoading/LazyLoadedPreview'; // Adjust the import path as needed
import { FileObject } from './FileUpload';

interface FileUploadObjectProps {
    guikey: string,
    item: FileObject
    isDragging: boolean;
    deleteFile: (guikey: string) => void;
    replaceFile: (guikey: string) => void;
    insertFilesFront: (guikey: string) => void;
    insertFilesBehind: (guikey: string) => void;
    getPreviewUrl: (fileId: number) => string;
}

const FileUploadObject = forwardRef<HTMLDivElement, FileUploadObjectProps>((
    { guikey, item, isDragging, deleteFile, replaceFile, insertFilesFront, insertFilesBehind, getPreviewUrl }, ref) => {
    return (
        <div ref={ref} key={guikey} className="bg-gray-200 rounded-2xl text-ellipsis border-2 border-white">
            <div className="grid-item-content relative w-full h-full">
                <div
                    className={`draggable-area absolute inset-0 z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                ></div>
                <div className="non-draggable absolute top-0 right-0 z-20">
                    <Dropdown
                        guikey={guikey}
                        onDelete={deleteFile}
                        onReplace={replaceFile}
                        onInsertFront={insertFilesFront}
                        onInsertBehind={insertFilesBehind}
                    />
                </div>
                <div className="file-content relative z-10 pointer-events-none select-none">
                    <div className="file-preview-container">
                        <div className="file-preview-content">
                            <LazyLoadedPreview
                                getPreviewUrl={getPreviewUrl}
                                fileId={item.id}
                                filename={item.filename}
                                type={item.type}
                            />
                        </div>
                    </div>
                    <div className="file-name-container">
                        <div className="file-name">{item.filename}</div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FileUploadObject;
