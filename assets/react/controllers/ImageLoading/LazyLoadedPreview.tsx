import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import './LazyLoading.css'

interface PreviewProps {
    getPreviewUrl: (filename: number) => string;
    fileId: number;
    filename: string;
    type: string;
}

const LazyLoadedPreview: React.FC<PreviewProps> = ({ getPreviewUrl, fileId, type, filename }) => {
    return (
        <div className="lazy-load-wrapper">
            <LazyLoadImage
                alt={type === "image" ? filename : `PDF: ${filename}`}
                effect="opacity"
                src={getPreviewUrl(fileId)}
                className={`lazy-load-image rounded-2xl ${type === "image" ? "file-preview-image" : "file-preview-pdf"}`}
                wrapperClassName="lazy-load-image-wrapper"
                placeholder={
                    <div className="lazy-load-placeholder">
                        Loading...
                    </div>
                }
            />
        </div>
    );
};

export default LazyLoadedPreview;
