import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Image, Paperclip } from 'lucide-react';
import { Message, UserPreferences } from '../types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { aiService } from '../services/aiService';

interface ChatInterfaceProps {
  userPreferences: UserPreferences;
  isVoiceActive: boolean;
  onVoiceToggle: (active: boolean) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userPreferences,
  isVoiceActive,
  onVoiceToggle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${userPreferences.name}! I'm your AI farming assistant. I can help you with plant identification, weather advice, and general farming questions. What would you like to know?`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await aiService.generateResponse(text, userPreferences);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800">Farm Assistant Chat</h2>
        <p className="text-sm text-gray-600">Ask me anything about farming, plants, or weather</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your farming question..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                type="button"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Image size={18} />
              </button>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onVoiceToggle(!isVoiceActive)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isVoiceActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
            }`}
          >
            {isVoiceActive ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-all duration-300"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};