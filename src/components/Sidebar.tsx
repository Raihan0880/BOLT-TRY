import React from 'react';
import { MessageSquare, Camera, CloudRain, BarChart3, User, Settings } from 'lucide-react';
import { UserPreferences } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: 'chat' | 'plant' | 'weather' | 'dashboard') => void;
  userPreferences: UserPreferences;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userPreferences }) => {
  const menuItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat', description: 'Ask questions' },
    { id: 'plant', icon: Camera, label: 'Plant ID', description: 'Identify plants' },
    { id: 'weather', icon: CloudRain, label: 'Weather', description: 'Get advice' },
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', description: 'View analytics' },
  ];

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Welcome back, {userPreferences.name}!</h3>
            <p className="text-sm text-gray-600">{userPreferences.region}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-2 border-green-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-green-500' : 'text-gray-500'} />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300">
          <Settings size={20} className="text-gray-500" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};