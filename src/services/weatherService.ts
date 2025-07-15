import axios from 'axios';
import { WeatherData } from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      // Get coordinates for the location
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${WEATHER_API_KEY}`
      );

      if (geoResponse.data.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geoResponse.data[0];

      // Get current weather
      const weatherResponse = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );

      // Get 5-day forecast
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );

      const current = weatherResponse.data;
      const forecast = forecastResponse.data;

      return {
        location: `${current.name}, ${current.sys.country}`,
        temperature: Math.round(current.main.temp),
        humidity: current.main.humidity,
        conditions: this.capitalizeWords(current.weather[0].description),
        advice: this.generateFarmingAdvice(current),
        forecast: this.processForecast(forecast.list)
      };
    } catch (error) {
      console.error('Weather Service Error:', error);
      return this.getFallbackWeatherData(location);
    }
  }

  private generateFarmingAdvice(weatherData: any): string[] {
    const advice: string[] = [];
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].main.toLowerCase();

    // Temperature-based advice
    if (temp < 5) {
      advice.push('Protect sensitive plants from frost - consider row covers or bringing potted plants indoors');
    } else if (temp > 30) {
      advice.push('Provide shade for sensitive plants and increase watering frequency during hot weather');
    } else if (temp >= 15 && temp <= 25) {
      advice.push('Ideal temperature for most outdoor farming activities and planting');
    }

    // Humidity-based advice
    if (humidity > 80) {
      advice.push('High humidity may increase disease risk - ensure good air circulation around plants');
    } else if (humidity < 40) {
      advice.push('Low humidity may stress plants - consider mulching to retain soil moisture');
    }

    // Weather condition advice
    if (condition.includes('rain')) {
      advice.push('Skip watering today - natural rainfall should be sufficient for most plants');
      advice.push('Good time for indoor tasks like seed starting or planning');
    } else if (condition.includes('sun')) {
      advice.push('Excellent conditions for photosynthesis and plant growth');
      advice.push('Good day for transplanting and outdoor farming activities');
    } else if (condition.includes('cloud')) {
      advice.push('Overcast conditions are ideal for transplanting to reduce plant stress');
    }

    return advice.length > 0 ? advice : ['Monitor your plants and adjust care based on their specific needs'];
  }

  private processForecast(forecastList: any[]): Array<{day: string, temp: number, condition: string}> {
    const dailyForecasts: { [key: string]: any } = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = {
          temps: [],
          conditions: [],
          date: date
        };
      }
      
      dailyForecasts[dayKey].temps.push(item.main.temp);
      dailyForecasts[dayKey].conditions.push(item.weather[0].main);
    });

    return Object.values(dailyForecasts)
      .slice(0, 5)
      .map((day: any) => ({
        day: day.date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length),
        condition: this.getMostCommonCondition(day.conditions)
      }));
  }

  private getMostCommonCondition(conditions: string[]): string {
    const counts: { [key: string]: number } = {};
    conditions.forEach(condition => {
      counts[condition] = (counts[condition] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  private getFallbackWeatherData(location: string): WeatherData {
    return {
      location: location,
      temperature: 22,
      humidity: 65,
      conditions: 'Partly Cloudy',
      advice: [
        'Unable to fetch current weather data',
        'Please check your internet connection',
        'Consider checking local weather services for current conditions'
      ],
      forecast: [
        { day: 'Today', temp: 22, condition: 'Partly Cloudy' },
        { day: 'Tomorrow', temp: 24, condition: 'Sunny' },
        { day: 'Thu', temp: 20, condition: 'Cloudy' },
        { day: 'Fri', temp: 23, condition: 'Sunny' },
        { day: 'Sat', temp: 25, condition: 'Sunny' }
      ]
    };
  }
}

export const weatherService = new WeatherService();