import React from 'react';
import { BarChart3, TrendingUp, Activity, Calendar } from 'lucide-react';
import { UserPreferences } from '../types';

interface DashboardProps {
  userPreferences: UserPreferences;
}

export const Dashboard: React.FC<DashboardProps> = ({ userPreferences }) => {
  const stats = [
    { label: 'Plants Identified', value: '24', change: '+12%', icon: Activity, color: 'green' },
    { label: 'Questions Asked', value: '156', change: '+8%', icon: BarChart3, color: 'blue' },
    { label: 'Weather Checks', value: '89', change: '+15%', icon: TrendingUp, color: 'purple' },
    { label: 'Days Active', value: '7', change: 'New', icon: Calendar, color: 'orange' }
  ];

  const recentActivity = [
    { action: 'Identified Tomato Plant', time: '2 hours ago', type: 'plant' },
    { action: 'Asked about watering schedule', time: '4 hours ago', type: 'question' },
    { action: 'Checked weather for planting', time: '6 hours ago', type: 'weather' },
    { action: 'Identified Rose Bush', time: '1 day ago', type: 'plant' },
    { action: 'Asked about pest control', time: '1 day ago', type: 'question' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'plant': return '🌱';
      case 'question': return '❓';
      case 'weather': return '🌤️';
      default: return '📊';
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your farming journey and get insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              green: 'bg-green-50 text-green-500',
              blue: 'bg-blue-50 text-blue-500',
              purple: 'bg-purple-50 text-purple-500',
              orange: 'bg-orange-50 text-orange-500'
            };
            
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">🌱</div>
                <p className="text-sm font-medium text-gray-700">Identify Plant</p>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">🌤️</div>
                <p className="text-sm font-medium text-gray-700">Check Weather</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm font-medium text-gray-700">Ask Question</p>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium text-gray-700">View Reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};