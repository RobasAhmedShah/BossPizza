import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { MenuItem, MenuItemSize } from '../lib/supabase';

interface PizzaSizeSelectorProps {
  pizza: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (pizza: MenuItem, selectedSize: MenuItemSize) => void;
}

const PizzaSizeSelector: React.FC<PizzaSizeSelectorProps> = ({
  pizza,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(null);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(pizza, selectedSize);
      onClose();
      setSelectedSize(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedSize(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 animate-modal-enter max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={pizza.image_url}
              alt={pizza.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{pizza.name}</h3>
              <p className="text-sm text-gray-600">Choose your size</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {pizza.description}
        </p>

        {/* Size Options */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-900">Available Sizes:</h4>
          {pizza.sizes
            .filter(size => size.is_available)
            .sort((a, b) => a.price - b.price)
            .map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedSize?.id === size.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {size.size_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Perfect for {
                        size.size_name === '6"' ? '1 person' :
                        size.size_name === '9"' ? '1-2 people' :
                        size.size_name === '12"' ? '2-3 people' :
                        '3-4 people'
                      }
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-primary-600">
                      PKR {size.price.toLocaleString()}
                    </span>
                    {selectedSize?.id === size.id && (
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium touch-manipulation min-h-[48px]"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="flex-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[48px]"
          >
            Add to Cart - PKR {selectedSize?.price || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaSizeSelector;