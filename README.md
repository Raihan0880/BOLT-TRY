# AI-Powered Farming Assistant

A comprehensive farming assistant application with real AI integration, plant identification, weather data, and voice interaction capabilities.

## Features

- **Real AI Chat**: Powered by Google's Gemini AI for intelligent farming advice
- **Plant Identification**: Upload plant images for AI-powered identification and health assessment
- **Weather Integration**: Real-time weather data with farming-specific advice
- **Voice Assistant**: Speech recognition and synthesis for hands-free interaction
- **Multi-language Support**: Configurable language preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. API Keys Required

Create a `.env.local` file in the root directory with the following API keys:

```env
# Google Gemini AI (Required for chat functionality)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenWeatherMap API (Required for weather data)
VITE_WEATHER_API_KEY=your_openweather_api_key_here

# Plant.id API (Required for plant identification)
VITE_PLANT_API_KEY=your_plant_id_api_key_here
```

### 2. Getting API Keys

#### Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `VITE_GEMINI_API_KEY`

#### OpenWeatherMap
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get a free API key
3. Copy the key to `VITE_WEATHER_API_KEY`

#### Plant.id
1. Sign up at [Plant.id](https://web.plant.id/)
2. Get an API key (free tier available)
3. Copy the key to `VITE_PLANT_API_KEY`

### 3. Installation

```bash
npm install
npm run dev
```

## Usage

1. **Welcome Screen**: Set your name, region, and language preferences
2. **Chat Interface**: Ask farming questions and get AI-powered responses
3. **Plant Identification**: Upload plant photos for identification and care advice
4. **Weather Advice**: Get location-specific weather and farming recommendations
5. **Voice Assistant**: Use voice commands for hands-free interaction
6. **Dashboard**: Track your farming activities and insights

## Browser Compatibility

- **Voice Features**: Requires modern browsers with Web Speech API support
- **Image Upload**: All modern browsers supported
- **Responsive Design**: Works on all screen sizes

## Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Service**: Google Gemini AI
- **Weather API**: OpenWeatherMap
- **Plant ID**: Plant.id API
- **Voice**: Web Speech API
- **Build Tool**: Vite

## Fallback Behavior

The application includes fallback responses when APIs are unavailable:
- Chat continues with basic responses if AI service fails
- Weather shows cached/demo data if API is down
- Plant identification provides general care advice if service fails
- Voice features gracefully degrade if not supported

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your API keys to `.env.local`
4. Test your changes
5. Submit a pull request

## License

MIT License - see LICENSE file for details