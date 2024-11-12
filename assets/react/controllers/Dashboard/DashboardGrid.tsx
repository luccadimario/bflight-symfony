import React from 'react';

const DashboardGrid: React.FC<DashboardGridProps> = ({gridTitle, gridElements}) => {
    return (
        <div className="w-full rounded-2xl bg-gray-200 p-8 shadow-xl">
            <div className="font-semibold text-3xl">{gridTitle}</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {gridElements}
            </div>
        </div>
    );
};

interface DashboardGridProps {
    gridTitle: string,
    gridElements: React.ReactElement[]
}

export default DashboardGrid;