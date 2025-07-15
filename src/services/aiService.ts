import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserPreferences } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  async generateResponse(message: string, userPreferences: UserPreferences, context?: string): Promise<string> {
    try {
      const systemPrompt = `You are FarmAI, an expert agricultural assistant helping farmers and gardeners. 
      
User Info:
- Name: ${userPreferences.name}
- Region: ${userPreferences.region}
- Language: ${userPreferences.language}

Guidelines:
- Provide practical, actionable farming advice
- Consider the user's regional climate and conditions
- Be encouraging and supportive
- Use simple, clear language
- Focus on sustainable and organic practices when possible
- If you don't know something specific to their region, suggest consulting local agricultural extension services

${context ? `Additional Context: ${context}` : ''}

User Question: ${message}`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(message, userPreferences);
    }
  }

  private getFallbackResponse(message: string, userPreferences: UserPreferences): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('water')) {
      return `For watering in ${userPreferences.region}, I recommend checking soil moisture first. Generally, water early morning or evening to reduce evaporation. Most plants need about 1 inch of water per week, but this varies by plant type and local conditions.`;
    }
    
    if (lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
      return `Growing plants successfully in ${userPreferences.region} depends on your local climate zone. I'd recommend starting with native or adapted varieties. Would you like specific recommendations for your area?`;
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('bug')) {
      return `For pest management, I recommend integrated pest management (IPM) approaches. Start with beneficial insects, companion planting, and organic deterrents before considering chemical treatments. What specific pests are you dealing with?`;
    }
    
    return `Thank you for your question, ${userPreferences.name}! While I'm having trouble accessing my full knowledge base right now, I'd recommend consulting your local agricultural extension office in ${userPreferences.region} for region-specific advice. Is there anything else I can help you with?`;
  }

  async generateVoiceResponse(transcript: string, userPreferences: UserPreferences): Promise<string> {
    const response = await this.generateResponse(transcript, userPreferences, "This is a voice interaction, so keep responses concise and conversational.");
    return response;
  }
}

export const aiService = new AIService();