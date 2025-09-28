"use client";

import React from 'react';
import { 
  User, 
  Zap, 
  Activity, 
  Users, 
  Settings
} from 'lucide-react';

interface TabButtonProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-[#49ABFE] text-white shadow-lg transform scale-105' 
        : 'text-gray-600 hover:text-[#213046] hover:bg-gray-100 hover:scale-102'
    }`}
  >
    <Icon size={18} className="mr-2" />
    {label}
  </button>
);

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 p-2 sm:p-3 bg-white rounded-2xl shadow-sm">
      <TabButton id="profile" label="Profile" icon={User} isActive={activeTab === 'profile'} onClick={onTabChange} />
      <TabButton id="tip" label="Gift Creator" icon={Zap} isActive={activeTab === 'tip'} onClick={onTabChange} />
      <TabButton id="activity" label="Activity" icon={Activity} isActive={activeTab === 'activity'} onClick={onTabChange} />
      <TabButton id="creators" label="Creators" icon={Users} isActive={activeTab === 'creators'} onClick={onTabChange} />
      <TabButton id="settings" label="Settings" icon={Settings} isActive={activeTab === 'settings'} onClick={onTabChange} />
    </div>
  );
};

export default TabNavigation;
