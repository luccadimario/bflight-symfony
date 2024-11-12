import React, { useState } from 'react';

const FancySelectionButton: React.FC<FancySelectionButtonProps> = ({ onSelect, className }) => {
    const [selected, setSelected] = useState<'event' | 'file'>('event');

    const handleSelect = (option: 'event' | 'file') => {
        setSelected(option);
        onSelect(option);
    };

    return (
        <div className={`inline-grid grid-cols-2 bg-gray-100 rounded-lg overflow-hidden ${className}`}>
            <button
                className={`px-4 py-2 text-center cursor-pointer transition-colors duration-200 ${
                    selected === 'event' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
                }`}
                onClick={() => handleSelect('event')}
            >
                EVENT
            </button>
            <button
                className={`px-4 py-2 text-center cursor-pointer transition-colors duration-200 ${
                    selected === 'file' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
                }`}
                onClick={() => handleSelect('file')}
            >
                FILE
            </button>
        </div>
    );
};

interface FancySelectionButtonProps {
    onSelect: (selection: 'event' | 'file') => void;
    className?: string;
}

export default FancySelectionButton;
