# AI-Powered Farming Assistant

A comprehensive farming assistant application with AI integration, plant identification, weather data, voice interaction capabilities, and dark mode support.

## Features

- **AI Chat**: Intelligent farming advice with fallback responses
- **Plant Identification**: Upload plant images for identification and health assessment using free APIs
- **Weather Integration**: Real-time weather data with farming-specific advice using free weather services
- **Voice Assistant**: Speech recognition and synthesis for hands-free interaction
- **Multi-language Support**: Configurable language preferences
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. API Keys (Optional)

The application works with free APIs and fallback responses. For enhanced functionality, you can optionally add API keys by creating a `.env.local` file:

```env

# OpenWeatherMap API (Optional - falls back to free weather API)
VITE_WEATHER_API_KEY=your_openweather_api_key_here

# Note: Plant identification uses free PlantNet API
# Note: AI chat uses free Hugging Face API with intelligent fallbacks
```

### 2. Getting API Keys (Optional)

#### OpenWeatherMap
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get a free API key
3. Copy the key to `VITE_WEATHER_API_KEY`

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
6. **Dark Mode**: Toggle between light and dark themes in the sidebar
6. **Dashboard**: Track your farming activities and insights

## Browser Compatibility

- **Voice Features**: Requires modern browsers with Web Speech API support
- **Image Upload**: All modern browsers supported
- **Responsive Design**: Works on all screen sizes

## Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Service**: Hugging Face Inference API (free) with intelligent fallbacks
- **Weather API**: wttr.in (free) with OpenWeatherMap fallback
- **Plant ID**: PlantNet API (free) with basic analysis fallback
- **Voice**: Web Speech API
- **Build Tool**: Vite

## Fallback Behavior

The application is designed to work entirely with free services and includes comprehensive fallback responses:
- Chat continues with basic responses if AI service fails
- Weather shows demo data if free APIs are unavailable
- Plant identification provides general care advice with basic analysis
- Voice features gracefully degrade if not supported
- Dark mode persists user preference and respects system settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your API keys to `.env.local`
4. Test your changes
5. Submit a pull request

## License

MIT License - see LICENSE file for details