"use client";

import React from 'react';
import { 
  Activity, 
  Gift
} from 'lucide-react';

interface Transaction {
  id: number;
  creator: string;
  amount: number;
  date: string;
  type: string;
}

interface ActivityTabProps {
  transactions: Transaction[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ transactions }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-[#213046] mb-6 flex items-center">
          <Activity className="mr-2 text-[#49ABFE]" size={24} />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all hover:scale-102 transform">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#49ABFE] rounded-full flex items-center justify-center mr-4">
                  <Gift className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Gifted {tx.creator}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#213046]">₩{tx.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">KRW-S</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTab;
