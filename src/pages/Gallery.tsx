import React from 'react';
import { Camera, Clock } from 'lucide-react';

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Coming Soon - Stay tuned for amazing photos of our pizzas and restaurants
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Empty State */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Gallery Coming Soon</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you amazing photos of our delicious pizzas, 
            happy customers, and beautiful restaurants. Check back soon!
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Clock className="h-5 w-5" />
            <span className="text-lg">Stay tuned for updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;