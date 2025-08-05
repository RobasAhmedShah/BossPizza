import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Deal, MenuItem } from '../lib/supabase';

interface DealCustomizerProps {
  deal: Deal;
  availablePizzas: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (deal: Deal, selectedPizzas: { [key: string]: MenuItem }) => void;
}

const DealCustomizer: React.FC<DealCustomizerProps> = ({
  deal,
  availablePizzas,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedPizzas, setSelectedPizzas] = useState<{ [key: string]: MenuItem }>({});

  if (!isOpen) return null;

  // Parse deal items to find pizza requirements
  const dealItems = deal.items_included as any;
  const pizzaRequirements: { [key: string]: { size: string; count: number } } = {};

  // Extract pizza requirements from deal
  Object.entries(dealItems).forEach(([key, value]: [string, any]) => {
    if (key.toLowerCase().includes('pizza')) {
      pizzaRequirements[key] = value;
    }
  });

  const handlePizzaSelection = (requirementKey: string, pizza: MenuItem) => {
    setSelectedPizzas(prev => ({
      ...prev,
      [requirementKey]: pizza
    }));
  };

  const handleAddToCart = () => {
    const requiredSelections = Object.keys(pizzaRequirements).length;
    const madeSelections = Object.keys(selectedPizzas).length;

    if (madeSelections === requiredSelections) {
      onAddToCart(deal, selectedPizzas);
      onClose();
      setSelectedPizzas({});
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPizzas({});
  };

  const isComplete = Object.keys(pizzaRequirements).length === Object.keys(selectedPizzas).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{deal.name}</h3>
              <p className="text-primary-600 font-bold text-lg">PKR {deal.price.toLocaleString()}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Deal Description */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{deal.description}</p>
            
            {/* Deal Contents */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">This deal includes:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {Object.entries(dealItems).map(([key, value]: [string, any]) => (
                  <li key={key} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>
                      {typeof value === 'object' && value.count && value.size
                        ? `${value.count} ${key} (${value.size})`
                        : `${value} ${key}`
                      }
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pizza Selection */}
          {Object.keys(pizzaRequirements).length > 0 && (
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Choose your pizza flavors:</h4>
              
              {Object.entries(pizzaRequirements).map(([requirementKey, requirement]) => (
                <div key={requirementKey} className="space-y-3">
                  <h5 className="font-medium text-gray-800">
                    Select {requirementKey} ({requirement.size}):
                  </h5>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {availablePizzas.map((pizza) => (
                      <button
                        key={pizza.id}
                        onClick={() => handlePizzaSelection(requirementKey, pizza)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          selectedPizzas[requirementKey]?.id === pizza.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={pizza.image_url}
                            alt={pizza.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{pizza.name}</div>
                            <div className="text-sm text-gray-600 line-clamp-1">
                              {pizza.description}
                            </div>
                          </div>
                          {selectedPizzas[requirementKey]?.id === pizza.id && (
                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!isComplete}
              className="flex-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Deal to Cart - PKR {deal.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCustomizer;