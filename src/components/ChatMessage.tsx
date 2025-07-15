import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.isUser;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-green-500 ml-2' : 'bg-gray-200 mr-2'
        }`}>
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-gray-600" />
          )}
        </div>
        
        {/* Message bubble */}
        <div className={`px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-green-500 text-white rounded-br-md' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
        } shadow-sm`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-1 ${
            isUser ? 'text-green-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};