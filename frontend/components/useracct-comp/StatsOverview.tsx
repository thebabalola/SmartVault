"use client";

import React from 'react';
import { 
  TrendingUp, 
  Gift, 
  Heart, 
  Users, 
  Star
} from 'lucide-react';

interface Stats {
  totalGifted: number;
  creatorsSupported: number;
  giftsSent: number;
  favoriteCreators: number;
}

interface StatsOverviewProps {
  stats: Stats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-[#213046] mb-6 flex items-center">
        <TrendingUp className="mr-2 text-[#49ABFE]" size={24} />
        Activity Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all">
          <Gift className="mx-auto mb-2 text-[#213046]" size={24} />
          <p className="text-2xl font-bold text-[#213046]">{stats.giftsSent}</p>
          <p className="text-sm text-gray-600">Gifts Sent</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl hover:shadow-md transition-all">
          <Heart className="mx-auto mb-2 text-[#49ABFE]" size={24} />
          <p className="text-2xl font-bold text-[#49ABFE]">₩{(stats.totalGifted / 1000)}K</p>
          <p className="text-sm text-gray-600">Total Gifted</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all">
          <Users className="mx-auto mb-2 text-green-600" size={24} />
          <p className="text-2xl font-bold text-green-600">{stats.creatorsSupported}</p>
          <p className="text-sm text-gray-600">Creators Supported</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all">
          <Star className="mx-auto mb-2 text-purple-600" size={24} />
          <p className="text-2xl font-bold text-purple-600">{stats.favoriteCreators}</p>
          <p className="text-sm text-gray-600">Favorites</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
