import axios from 'axios';
import { PlantIdentification } from '../types';

const PLANT_API_KEY = import.meta.env.VITE_PLANT_API_KEY;
const PLANT_API_URL = 'https://api.plant.id/v2/identify';

export class PlantService {
  async identifyPlant(imageBase64: string): Promise<PlantIdentification> {
    try {
      const response = await axios.post(
        PLANT_API_URL,
        {
          api_key: PLANT_API_KEY,
          images: [imageBase64],
          modifiers: ['crops_fast', 'similar_images', 'health_only', 'disease_similar_images'],
          plant_language: 'en',
          plant_details: ['common_names', 'url', 'description', 'taxonomy', 'rank', 'gbif_id', 'inaturalist_id', 'image', 'synonyms', 'edible_parts', 'watering']
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = response.data;
      
      if (data.suggestions && data.suggestions.length > 0) {
        const topSuggestion = data.suggestions[0];
        const plant = topSuggestion.plant_details;
        
        return {
          name: plant.common_names?.[0] || plant.structured_name?.genus || 'Unknown Plant',
          confidence: topSuggestion.probability,
          health: this.assessPlantHealth(data.health_assessment),
          recommendations: this.generateRecommendations(plant, data.health_assessment),
          image: topSuggestion.similar_images?.[0]?.url
        };
      } else {
        throw new Error('No plant identification results');
      }
    } catch (error) {
      console.error('Plant Service Error:', error);
      return this.getFallbackIdentification();
    }
  }

  private assessPlantHealth(healthAssessment: any): string {
    if (!healthAssessment || !healthAssessment.suggestions) {
      return 'Unable to assess';
    }

    const diseases = healthAssessment.suggestions.filter((s: any) => s.name !== 'healthy');
    
    if (diseases.length === 0) {
      return 'Healthy';
    } else if (diseases[0].probability > 0.7) {
      return 'Unhealthy';
    } else {
      return 'Monitor closely';
    }
  }

  private generateRecommendations(plantDetails: any, healthAssessment: any): string[] {
    const recommendations: string[] = [];

    // Basic care recommendations
    if (plantDetails.watering) {
      recommendations.push(`Watering: ${plantDetails.watering.max} - ${plantDetails.watering.min}`);
    }

    // Health-based recommendations
    if (healthAssessment && healthAssessment.suggestions) {
      const diseases = healthAssessment.suggestions.filter((s: any) => s.name !== 'healthy');
      
      if (diseases.length > 0) {
        const topDisease = diseases[0];
        recommendations.push(`Potential issue detected: ${topDisease.name}`);
        recommendations.push('Consider consulting a plant pathologist or local extension service');
      }
    }

    // General recommendations
    recommendations.push('Ensure adequate sunlight based on plant requirements');
    recommendations.push('Monitor soil moisture and drainage');
    recommendations.push('Check for pests regularly');

    return recommendations.length > 0 ? recommendations : [
      'Provide appropriate sunlight for your plant type',
      'Water when soil feels dry to touch',
      'Monitor for signs of pests or disease',
      'Consider fertilizing during growing season'
    ];
  }

  private getFallbackIdentification(): PlantIdentification {
    return {
      name: 'Plant identification unavailable',
      confidence: 0,
      health: 'Unable to assess',
      recommendations: [
        'Plant identification service is currently unavailable',
        'Try taking a clearer photo with good lighting',
        'Consider consulting local gardening experts',
        'Check plant identification apps or field guides'
      ]
    };
  }

  async analyzeImageFile(file: File): Promise<PlantIdentification> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
          const result = await this.identifyPlant(base64Data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
}

export const plantService = new PlantService();