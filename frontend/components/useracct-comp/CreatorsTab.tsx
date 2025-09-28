"use client";

import React from 'react';
import { 
  Heart
} from 'lucide-react';

interface Creator {
  name: string;
  category: string;
  avatar: string;
  gifted: number;
}

interface CreatorsTabProps {
  creators: Creator[];
}

const CreatorsTab: React.FC<CreatorsTabProps> = ({ creators }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-[#213046] mb-6 flex items-center">
          <Heart className="mr-2 text-[#49ABFE]" size={24} />
          Supported Creators
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {creators.map((creator, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all hover:scale-102 transform">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{creator.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{creator.name}</p>
                    <p className="text-sm text-gray-500">{creator.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#213046]">₩{creator.gifted.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Gifted</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorsTab;
