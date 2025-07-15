import { UserPreferences } from '../types';

export class AIService {
  async generateResponse(message: string, userPreferences: UserPreferences, context?: string): Promise<string> {
    try {
      // Using Hugging Face's free inference API as fallback
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: this.buildPrompt(message, userPreferences, context),
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data[0]?.generated_text || this.getFallbackResponse(message, userPreferences);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
    }
    
    return this.getFallbackResponse(message, userPreferences);
  }

  private buildPrompt(message: string, userPreferences: UserPreferences, context?: string): string {
    return `You are FarmAI, an expert agricultural assistant helping ${userPreferences.name} in ${userPreferences.region}. 
    
${context ? `Context: ${context}` : ''}

Question: ${message}

Answer:`;
  }

  private getFallbackResponse(message: string, userPreferences: UserPreferences): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('water')) {
      return `For watering in ${userPreferences.region}, I recommend checking soil moisture first. Generally, water early morning or evening to reduce evaporation. Most plants need about 1 inch of water per week, but this varies by plant type and local conditions.`;
    }
    
    if (lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
      return `Growing plants successfully in ${userPreferences.region} depends on your local climate zone. I'd recommend starting with native or adapted varieties. Consider factors like soil type, sunlight exposure, and local growing seasons.`;
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('bug')) {
      return `For pest management, I recommend integrated pest management (IPM) approaches. Start with beneficial insects, companion planting, and organic deterrents. Neem oil, diatomaceous earth, and companion plants like marigolds can help naturally deter pests.`;
    }

    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      return `For healthy plant nutrition, consider organic options like compost, worm castings, or fish emulsion. Test your soil pH first - most vegetables prefer 6.0-7.0 pH. Nitrogen promotes leafy growth, phosphorus supports roots and flowers, and potassium strengthens overall plant health.`;
    }

    if (lowerMessage.includes('soil')) {
      return `Good soil is the foundation of successful farming! Test your soil pH and add organic matter like compost to improve structure. Well-draining soil with good organic content supports healthy root development and nutrient uptake.`;
    }

    if (lowerMessage.includes('season') || lowerMessage.includes('when')) {
      return `Timing depends on your local climate in ${userPreferences.region}. Generally, cool-season crops (lettuce, peas, broccoli) can handle light frost, while warm-season crops (tomatoes, peppers, squash) need warm soil and no frost risk. Check your local last frost date for planting guidance.`;
    }
    
    return `Thank you for your question, ${userPreferences.name}! Based on general farming principles for ${userPreferences.region}, I'd recommend consulting your local agricultural extension office for region-specific advice. They often provide free resources and expertise tailored to your exact location and growing conditions.`;
  }

  async generateVoiceResponse(transcript: string, userPreferences: UserPreferences): Promise<string> {
    const response = await this.generateResponse(transcript, userPreferences, "Keep this response concise and conversational for voice interaction.");
    return response;
  }
}

export const aiService = new AIService();