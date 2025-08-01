import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { UserPreferences, WeatherData } from '../types';
import { weatherService } from '../services/weatherService';

interface WeatherAdviceProps {
  userPreferences: UserPreferences;
  isDarkMode: boolean;
}

export const WeatherAdvice: React.FC<WeatherAdviceProps> = ({ userPreferences, isDarkMode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getCurrentWeather(userPreferences.region);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError('Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userPreferences.region) {
      fetchWeatherData();
    } else {
      setLoading(false);
    }
  }, [userPreferences.region]);

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <Sun className="text-yellow-500" size={24} />;
    }
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="text-blue-500" size={24} />;
    }
    if (lowerCondition.includes('cloud')) {
      return <Cloud className="text-gray-500" size={24} />;
    }
    if (lowerCondition.includes('wind')) {
      return <Wind className="text-gray-600" size={24} />;
    }
    return <Sun className="text-yellow-500" size={24} />;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 5) return 'text-blue-600';
    if (temp < 15) return 'text-cyan-600';
    if (temp < 25) return 'text-green-600';
    if (temp < 35) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return 'text-red-600';
    if (humidity < 60) return 'text-green-600';
    if (humidity < 80) return 'text-blue-600';
    return 'text-purple-600';
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

  if (error) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Weather Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Weather-Based Advice</h1>
            <p className="text-gray-600 dark:text-gray-400">Get farming recommendations based on local weather conditions</p>
          </div>
          <button
            onClick={fetchWeatherData}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Current Weather</h2>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={16} />
                  <span>{weatherData.location}</span>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="text-center">
                {getWeatherIcon(weatherData.conditions)}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{weatherData.conditions}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer size={20} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                </div>
                <p className={`text-2xl font-bold ${getTemperatureColor(weatherData.temperature)}`}>
                  {weatherData.temperature}°C
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets size={20} className="text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Humidity</span>
                </div>
                <p className={`text-2xl font-bold ${getHumidityColor(weatherData.humidity)}`}>
                  {weatherData.humidity}%
                </p>
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
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{day.day}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{day.condition}</p>
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${getTemperatureColor(day.temp)}`}>{day.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">⚠️ Weather Alerts</h3>
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              {weatherData.temperature > 30 && (
                <p>• High temperature warning - provide shade for sensitive plants</p>
              )}
              {weatherData.temperature < 5 && (
                <p>• Frost warning - protect sensitive plants from cold damage</p>
              )}
              {weatherData.humidity > 80 && (
                <p>• High humidity - monitor for fungal diseases</p>
              )}
              {weatherData.humidity < 40 && (
                <p>• Low humidity - increase watering frequency</p>
              )}
              {!weatherData.temperature && !weatherData.humidity && (
                <p>• No weather alerts at this time</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">💡 Quick Tips</h3>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <p>• Check soil moisture before watering</p>
              <p>• Early morning is best time for watering</p>
              <p>• Monitor plants for stress signs</p>
              <p>• Adjust care based on weather conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};