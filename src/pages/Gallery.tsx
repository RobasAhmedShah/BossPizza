import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    // Pizza Items
    {
      id: 1,
      src: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Margherita Pizza fresh from oven',
      category: 'pizza',
      title: 'Classic Margherita'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Pepperoni Pizza with melted cheese',
      category: 'pizza',
      title: 'Pepperoni Special'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Supreme Pizza with multiple toppings',
      category: 'pizza',
      title: 'Supreme Delight'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Wood-fired pizza in stone oven',
      category: 'pizza',
      title: 'Wood-Fired Perfection'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'BBQ Chicken Pizza',
      category: 'pizza',
      title: 'BBQ Chicken'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Vegetarian Pizza with fresh vegetables',
      category: 'pizza',
      title: 'Garden Fresh'
    },
    
    // Customers Enjoying
    {
      id: 7,
      src: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Happy family enjoying pizza together',
      category: 'customers',
      title: 'Family Time'
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Friends sharing pizza and laughing',
      category: 'customers',
      title: 'Friends Gathering'
    },
    {
      id: 9,
      src: 'https://images.pexels.com/photos/3184195/pexels-photo-3184195.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Couple on a pizza date',
      category: 'customers',
      title: 'Perfect Date Night'
    },
    {
      id: 10,
      src: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Kids enjoying pizza party',
      category: 'customers',
      title: 'Birthday Celebration'
    },
    
    // Shop Interior
    {
      id: 11,
      src: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Modern pizza restaurant interior',
      category: 'interior',
      title: 'Modern Ambience'
    },
    {
      id: 12,
      src: 'https://images.pexels.com/photos/1581394/pexels-photo-1581394.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Cozy dining area with warm lighting',
      category: 'interior',
      title: 'Cozy Dining'
    },
    {
      id: 13,
      src: 'https://images.pexels.com/photos/1581412/pexels-photo-1581412.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Open kitchen with pizza oven',
      category: 'interior',
      title: 'Open Kitchen'
    },
    {
      id: 14,
      src: 'https://images.pexels.com/photos/1581426/pexels-photo-1581426.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Elegant bar area',
      category: 'interior',
      title: 'Bar Area'
    },
    {
      id: 15,
      src: 'https://images.pexels.com/photos/1581438/pexels-photo-1581438.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Outdoor seating area',
      category: 'interior',
      title: 'Outdoor Seating'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos', count: galleryImages.length },
    { id: 'pizza', name: 'Pizza Items', count: galleryImages.filter(img => img.category === 'pizza').length },
    { id: 'customers', name: 'Happy Customers', count: galleryImages.filter(img => img.category === 'customers').length },
    { id: 'interior', name: 'Shop Interior', count: galleryImages.filter(img => img.category === 'interior').length }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Take a visual journey through our delicious pizzas, happy customers, and cozy atmosphere
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-bold text-lg">{image.title}</h3>
                <p className="text-sm text-gray-200 capitalize">{image.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
              <h3 className="text-xl font-bold mb-1">{filteredImages[selectedImage].title}</h3>
              <p className="text-gray-300 capitalize">{filteredImages[selectedImage].category}</p>
              <p className="text-sm text-gray-400 mt-2">
                {selectedImage + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;