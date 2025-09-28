"use client";

import React from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  ChevronRight
} from 'lucide-react';

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-[#213046] mb-6 flex items-center">
          <Settings className="mr-2 text-[#49ABFE]" size={24} />
          Account Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center">
              <Bell className="mr-3 text-[#213046]" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Notifications</p>
                <p className="text-sm text-gray-500">Manage your notification preferences</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center">
              <Shield className="mr-3 text-[#213046]" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Privacy & Security</p>
                <p className="text-sm text-gray-500">Control your privacy settings</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center">
              <CreditCard className="mr-3 text-[#213046]" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Payment Methods</p>
                <p className="text-sm text-gray-500">Manage wallets and payment options</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
