import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { UserPreferences, VoiceState } from '../types';
import { voiceService } from '../services/voiceService';
import { aiService } from '../services/aiService';

interface VoiceAssistantProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  userPreferences: UserPreferences;
  isDarkMode: boolean;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isActive,
  onToggle,
  userPreferences,
  isDarkMode
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false
  });

  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (isActive) {
      startVoiceInteraction();
    } else {
      setVoiceState({ isListening: false, isProcessing: false, isSpeaking: false });
      setTranscript('');
      voiceService.stopListening();
      voiceService.stopSpeaking();
    }
  }, [isActive]);

  const startVoiceInteraction = async () => {
    if (!voiceService.isSupported()) {
      setTranscript('Voice features are not supported in this browser');
      return;
    }

    try {
      setVoiceState(prev => ({ ...prev, isListening: true }));
      setTranscript('Listening...');
      
      const userSpeech = await voiceService.startListening();
      setTranscript(`You said: "${userSpeech}"`);
      
      setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: true }));
      
      const aiResponse = await aiService.generateVoiceResponse(userSpeech, userPreferences);
      
      setVoiceState(prev => ({ ...prev, isProcessing: false, isSpeaking: true }));
      setTranscript(aiResponse);
      
      await voiceService.speak(aiResponse);
      
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      
      // Auto-restart listening after a brief pause
      setTimeout(() => {
        if (isActive) {
          startVoiceInteraction();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Voice interaction error:', error);
      setVoiceState({ isListening: false, isProcessing: false, isSpeaking: false });
      setTranscript('Voice interaction failed. Please try again.');
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Voice Assistant</h3>
          <button
            onClick={() => onToggle(false)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <VolumeX size={20} />
          </button>
        </div>

        {/* Voice Visualization */}
        <div className="flex items-center justify-center mb-4">
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            voiceState.isListening 
              ? 'bg-green-500 animate-pulse' 
              : voiceState.isProcessing 
                ? 'bg-blue-500 animate-spin' 
                : voiceState.isSpeaking 
                  ? 'bg-purple-500 animate-bounce' 
                  : 'bg-gray-300'
          }`}>
            <Mic size={32} className="text-white" />
            
            {/* Ripple effect for listening */}
            {voiceState.isListening && (
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"></div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {voiceState.isListening && 'Listening...'}
            {voiceState.isProcessing && 'Processing...'}
            {voiceState.isSpeaking && 'Speaking...'}
            {!voiceState.isListening && !voiceState.isProcessing && !voiceState.isSpeaking && 'Ready'}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{transcript}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onToggle(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
          >
            <MicOff size={16} />
            <span>Stop</span>
          </button>
          
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl transition-colors flex items-center space-x-2">
            <Volume2 size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};