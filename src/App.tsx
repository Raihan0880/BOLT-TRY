import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { PlantIdentifier } from './components/PlantIdentifier';
import { WeatherAdvice } from './components/WeatherAdvice';
import { VoiceAssistant } from './components/VoiceAssistant';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserPreferences } from './types';

function App() {
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

  if (userPreferences.isFirstTime) {
    return (
      <WelcomeScreen 
        onComplete={handleWelcomeComplete}
        preferences={userPreferences}
        onPreferencesChange={updatePreferences}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userPreferences={userPreferences}
      />
      
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatInterface 
            userPreferences={userPreferences}
            isVoiceActive={isVoiceActive}
            onVoiceToggle={setIsVoiceActive}
          />
        )}
        {activeTab === 'plant' && (
          <PlantIdentifier userPreferences={userPreferences} />
        )}
        {activeTab === 'weather' && (
          <WeatherAdvice userPreferences={userPreferences} />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard userPreferences={userPreferences} />
        )}
      </main>

      <VoiceAssistant 
        isActive={isVoiceActive}
        onToggle={setIsVoiceActive}
        userPreferences={userPreferences}
      />
    </div>
  );
}

export default App;