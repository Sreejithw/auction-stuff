// ItemInfo.tsx
import React from "react";

type ItemInfoProps = {
    item: {
        name: string;
        description: string;
        model: string;
        location: string;
    };
};

const ItemInfo: React.FC<ItemInfoProps> = ({ item }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold">{item.name}</h2>
            <p>{item.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div>
                        <p className="text-lg font-bold">{item.model}</p>
                        <p className="text-sm text-gray-500">Model</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div>
                        <p className="text-lg font-bold">{item.location}</p>
                        <p className="text-sm text-gray-500">Location</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemInfo;