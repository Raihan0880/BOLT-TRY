import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';
import { UserPreferences, WeatherData } from '../types';
import { weatherService } from '../services/weatherService';

interface WeatherAdviceProps {
  userPreferences: UserPreferences;
  isDarkMode: boolean;
}

export const WeatherAdvice: React.FC<WeatherAdviceProps> = ({ userPreferences, isDarkMode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await weatherService.getCurrentWeather(userPreferences.region);
        setWeatherData(data);
      } catch (error) {
        console.error('Weather fetch error:', error);
        // Fallback data will be provided by the service
        setWeatherData(await weatherService.getCurrentWeather(userPreferences.region));
      } finally {
        setLoading(false);
      }
    };

    if (userPreferences.region) {
      fetchWeatherData();
    } else {
      setLoading(false);
    }
  }, [userPreferences.region]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="text-yellow-500" size={24} />;
      case 'rainy': return <CloudRain className="text-blue-500" size={24} />;
      case 'cloudy': return <Cloud className="text-gray-500" size={24} />;
      case 'partly cloudy': return <Cloud className="text-gray-400" size={24} />;
      default: return <Sun className="text-yellow-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Weather-Based Advice</h1>
          <p className="text-gray-600 dark:text-gray-400">Get farming recommendations based on local weather conditions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Current Weather</h2>
                <p className="text-gray-600 dark:text-gray-400">{weatherData.location}</p>
              </div>
              {getWeatherIcon(weatherData.conditions)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer size={20} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{weatherData.temperature}°C</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets size={20} className="text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{weatherData.humidity}%</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Wind size={20} className="text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wind</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">12 km/h</p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud size={20} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conditions</span>
                </div>
                <p className="text-sm font-bold text-orange-600">{weatherData.conditions}</p>
              </div>
            </div>

            {/* Farming Advice */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Today's Farming Advice</h3>
              <div className="space-y-3">
                {weatherData.advice.map((advice, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">{advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">5-Day Forecast</h2>
            <div className="space-y-3">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{day.day}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{day.condition}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{day.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};