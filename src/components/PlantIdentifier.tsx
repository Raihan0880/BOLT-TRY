import React, { useState, useRef } from 'react';
import { Camera, Upload, Zap, Leaf, AlertCircle, CheckCircle } from 'lucide-react';
import { UserPreferences, PlantIdentification } from '../types';
import { plantService } from '../services/plantService';

interface PlantIdentifierProps {
  userPreferences: UserPreferences;
  isDarkMode: boolean;
}

export const PlantIdentifier: React.FC<PlantIdentifierProps> = ({ userPreferences, isDarkMode }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !fileInputRef.current?.files?.[0]) return;
    
    setIsAnalyzing(true);
    
    try {
      const file = fileInputRef.current.files[0];
      const result = await plantService.analyzeImageFile(file);
      setResult(result);
    } catch (error) {
      console.error('Plant identification error:', error);
      setResult({
        name: 'Identification failed',
        confidence: 0,
        health: 'Unable to assess',
        recommendations: [
          'Please try again with a clearer image',
          'Ensure good lighting and focus',
          'Make sure the plant is clearly visible',
          'Check your internet connection'
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getHealthIcon = (health: string) => {
    if (health === 'Healthy') return <CheckCircle className="text-green-500" size={20} />;
    if (health === 'Warning') return <AlertCircle className="text-yellow-500" size={20} />;
    return <AlertCircle className="text-red-500" size={20} />;
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Plant Identification</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload a photo to identify plants and get health recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upload Plant Image</h2>
            
            {!selectedImage ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <div className="mb-4">
                  <Camera size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Upload a clear photo of your plant</p>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Upload size={20} />
                    <span>Choose Image</span>
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                  <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                    <Camera size={20} />
                    <span>Take Photo</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Plant to identify"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        <span>Identify Plant</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                    }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Analysis Results</h2>
            
            {!result ? (
              <div className="text-center py-12">
                <Leaf size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Upload an image to see identification results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Plant Name */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{result.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      <span className="text-green-700 dark:text-green-400 text-sm font-medium">
                        {(result.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Status */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Health Status</h4>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(result.health)}
                    <span className="text-gray-700 dark:text-gray-300">{result.health}</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Care Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};