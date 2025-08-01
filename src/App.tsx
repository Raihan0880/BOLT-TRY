import React, { useState, useEffect } from 'react';
import { Thermometer } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { PlantIdentifier } from './components/PlantIdentifier';
import { WeatherAdvice } from './components/WeatherAdvice';
import { VoiceAssistant } from './components/VoiceAssistant';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserPreferences } from './types';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'welcome' | 'chat' | 'plant' | 'weather' | 'dashboard'>('welcome');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    language: 'en',
    region: '',
    name: '',
    isFirstTime: true
  });
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage
    const saved = localStorage.getItem('farming-assistant-preferences');
    if (saved) {
      setUserPreferences(JSON.parse(saved));
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPrefs = { ...userPreferences, ...updates };
    setUserPreferences(newPrefs);
    localStorage.setItem('farming-assistant-preferences', JSON.stringify(newPrefs));
  };

  const handleWelcomeComplete = (name: string, region: string) => {
    updatePreferences({ name, region, isFirstTime: false });
    setActiveTab('chat');
  };

  const handleVoiceCommand = (command: string, response: string) => {
    // Handle voice commands that might change tabs
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('show dashboard')) {
      setActiveTab('dashboard');
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('check weather')) {
      setActiveTab('weather');
    } else if (lowerCommand.includes('plant') || lowerCommand.includes('identify plant')) {
      setActiveTab('plant');
    } else if (lowerCommand.includes('chat') || lowerCommand.includes('talk')) {
      setActiveTab('chat');
    }
    
    if (lowerCommand.includes('stop listening') || lowerCommand.includes('stop voice')) {
      setIsVoiceActive(false);
    }
  };

  // Quick weather access
  const handleQuickWeatherCheck = () => {
    setActiveTab('weather');
  };

  if (userPreferences.isFirstTime) {
    return (
      <WelcomeScreen 
        onComplete={handleWelcomeComplete}
        preferences={userPreferences}
        onPreferencesChange={updatePreferences}
        isDarkMode={isDarkMode}
        onDarkModeToggle={toggleDarkMode}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userPreferences={userPreferences}
        isDarkMode={isDarkMode}
        onDarkModeToggle={toggleDarkMode}
        isVoiceActive={isVoiceActive}
        onVoiceToggle={setIsVoiceActive}
      />
      
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatInterface 
            userPreferences={userPreferences}
            isVoiceActive={isVoiceActive}
            onVoiceToggle={setIsVoiceActive}
            isDarkMode={isDarkMode}
          />
        )}
        {activeTab === 'plant' && (
          <PlantIdentifier userPreferences={userPreferences} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'weather' && (
          <WeatherAdvice userPreferences={userPreferences} isDarkMode={isDarkMode} />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard userPreferences={userPreferences} isDarkMode={isDarkMode} />
        )}
      </main>

      {/* Quick Weather Floating Button */}
      <button
        onClick={handleQuickWeatherCheck}
        className="fixed bottom-6 left-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        title="Quick weather check"
      >
        <Thermometer size={20} />
      </button>
      <VoiceAssistant 
        isActive={isVoiceActive}
        onToggle={setIsVoiceActive}
        userPreferences={userPreferences}
        isDarkMode={isDarkMode}
        onVoiceCommand={handleVoiceCommand}
      />
    </div>
  );
}

export default App;