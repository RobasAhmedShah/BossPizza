import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, X, Plus, Minus, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';

interface CreateYourOwnPizzaProps {
  onClose: () => void;
}

interface PizzaSelection {
  crust: string;
  size: string;
  sauce: string;
  toppings: string[];
}

interface CrustOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface SizeOption {
  id: string;
  name: string;
  diameter: string;
  servings: string;
  price: { [key: string]: number };
  image: string;
}

interface SauceOption {
  id: string;
  name: string;
  description: string;
  spiceLevel: number;
  image: string;
}

interface ToppingOption {
  id: string;
  name: string;
  description: string;
  category: 'meat' | 'vegetable' | 'cheese';
  price: number;
  image: string;
}

const CreateYourOwnPizza: React.FC<CreateYourOwnPizzaProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const { addItem } = useCart();
  const { addToast } = useToast();
  
  const [selections, setSelections] = useState<PizzaSelection>({
    crust: '',
    size: '',
    sauce: '',
    toppings: [],
  });

  const steps = [
    { 
      title: 'Choose Your Crust', 
      key: 'crust', 
      description: 'Select the perfect foundation for your pizza',
      icon: '🍞'
    },
    { 
      title: 'Pick Your Size', 
      key: 'size', 
      description: 'How hungry are you today?',
      icon: '📏'
    },
    { 
      title: 'Select Your Sauce', 
      key: 'sauce', 
      description: 'Choose your flavor adventure',
      icon: '🥫'
    },
    { 
      title: 'Add Your Toppings', 
      key: 'toppings', 
      description: 'Make it uniquely yours!',
      icon: '🧀'
    },
  ];

  const crustOptions: CrustOption[] = [
    {
      id: 'original',
      name: 'Original Crust',
      description: 'Our signature hand-tossed crust with perfect thickness and golden edges',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'thin',
      name: 'Thin Crust',
      description: 'Crispy, light and perfectly crunchy - ideal for topping lovers',
      image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'pan',
      name: 'Pan Crust',
      description: 'Thick, fluffy and golden - comfort food at its finest',
      image: 'https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
  ];

  const sizeOptions: SizeOption[] = [
    {
      id: '6"',
      name: 'Personal',
      diameter: '6 inches',
      servings: '1 person',
      price: { original: 599, thin: 549, pan: 599 },
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '9"',
      name: 'Regular',
      diameter: '9 inches',
      servings: '1-2 people',
      price: { original: 1299, thin: 1249, pan: 1299 },
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=250'
    },
    {
      id: '12"',
      name: 'Medium',
      diameter: '12 inches',
      servings: '2-3 people',
      price: { original: 1499, thin: 1449, pan: 1499 },
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '15"',
      name: 'Large',
      diameter: '15 inches',
      servings: '3-4 people',
      price: { original: 2199, thin: 2149, pan: 2199 },
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=350'
    },
  ];

  const sauceOptions: SauceOption[] = [
    {
      id: 'fiery',
      name: 'Fiery Sauce',
      description: 'Bold and spicy tomato base with red chilies',
      spiceLevel: 3,
      image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'garlic',
      name: 'Creamy Garlic',
      description: 'Rich white sauce with roasted garlic and herbs',
      spiceLevel: 0,
      image: 'https://images.pexels.com/photos/4198016/pexels-photo-4198016.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'peri',
      name: 'Peri Peri Sauce',
      description: 'African bird\'s eye chili sauce with citrus notes',
      spiceLevel: 4,
      image: 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
  ];

  const toppingOptions: ToppingOption[] = [
    {
      id: 'chicken',
      name: 'Chicken',
      description: 'Tender grilled chicken pieces',
      category: 'meat',
      price: 150,
      image: 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'pepperoni',
      name: 'Pepperoni',
      description: 'Classic spicy pepperoni slices',
      category: 'meat',
      price: 180,
      image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'mushrooms',
      name: 'Mushrooms',
      description: 'Fresh button mushrooms',
      category: 'vegetable',
      price: 80,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'capsicum',
      name: 'Capsicum',
      description: 'Colorful bell peppers',
      category: 'vegetable',
      price: 70,
      image: 'https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'onion',
      name: 'Onion',
      description: 'Sweet red onions',
      category: 'vegetable',
      price: 50,
      image: 'https://images.pexels.com/photos/1329296/pexels-photo-1329296.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'jalapenos',
      name: 'Jalapeños',
      description: 'Spicy jalapeño peppers',
      category: 'vegetable',
      price: 90,
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'olives',
      name: 'Olives',
      description: 'Mediterranean black olives',
      category: 'vegetable',
      price: 100,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'cheese',
      name: 'Cheese Blend',
      description: 'Extra mozzarella and cheddar',
      category: 'cheese',
      price: 120,
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
  ];

  const calculatePrice = () => {
    if (!selections.crust || !selections.size) return 0;
    
    const sizeOption = sizeOptions.find(opt => opt.id === selections.size);
    if (!sizeOption) return 0;
    
    const basePrice = sizeOption.price[selections.crust] || 0;
    const toppingPrice = selections.toppings.reduce((total, toppingId) => {
      const topping = toppingOptions.find(t => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    
    return basePrice + toppingPrice;
  };

  const handleSelection = (key: string, value: string) => {
    if (key === 'toppings') {
      setSelections(prev => ({
        ...prev,
        [key]: prev.toppings.includes(value)
          ? prev.toppings.filter(item => item !== value)
          : [...prev.toppings, value]
      }));
    } else {
      setSelections(prev => ({ ...prev, [key]: value }));
    }
  };

  const canProceed = () => {
    const currentStepKey = steps[currentStep].key;
    if (currentStepKey === 'toppings') return true; // Toppings are optional
    return selections[currentStepKey as keyof PizzaSelection] !== '';
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const addToCart = () => {
    const selectedCrust = crustOptions.find(c => c.id === selections.crust);
    const selectedSize = sizeOptions.find(s => s.id === selections.size);
    const selectedSauce = sauceOptions.find(s => s.id === selections.sauce);
    const selectedToppings = toppingOptions.filter(t => selections.toppings.includes(t.id));

    const pizzaName = `Custom ${selectedSize?.name} ${selectedCrust?.name} Pizza`;
    const pizzaDescription = `${selectedSauce?.name} with ${selectedToppings.map(t => t.name).join(', ') || 'no toppings'}`;

    addItem({
      id: `custom-pizza-${Date.now()}`,
      name: pizzaName,
      price: calculatePrice(),
      image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'custom',
      options: {
        crust: selectedCrust?.name,
        size: selectedSize?.name,
        sauce: selectedSauce?.name,
        toppings: selectedToppings.map(t => t.name),
        description: pizzaDescription
      }
    });

    addToast({
      type: 'success',
      title: 'Pizza Added to Cart!',
      message: `Your custom ${selectedSize?.name} pizza has been added to your cart`,
      duration: 3000,
    });

    onClose();
  };

  const getSpiceIndicator = (level: number) => {
    return '🌶️'.repeat(level) + '⚪'.repeat(4 - level);
  };

  const isSelectionComplete = () => {
    return selections.crust && selections.size && selections.sauce;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 bg-gray-50 rounded-2xl p-4">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold transition-all duration-300
            ${index <= currentStep 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-500'
            }
          `}>
            {index < currentStep ? (
              <Check className="h-6 w-6" />
            ) : (
              <span className="text-lg">{step.icon}</span>
            )}
          </div>
          
          {index < steps.length - 1 && (
            <div className={`
              w-16 h-1 mx-2 rounded-full transition-all duration-300
              ${index < currentStep ? 'bg-primary-500' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderCrustStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Crust</h3>
        <p className="text-gray-600">The foundation of your perfect pizza</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {crustOptions.map((crust) => (
          <div
            key={crust.id}
            onClick={() => handleSelection('crust', crust.id)}
            className={`
              cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105
              ${selections.crust === crust.id 
                ? 'ring-4 ring-primary-500 shadow-2xl' 
                : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-primary-300 shadow-lg'
              }
            `}
          >
            <div className="relative">
              <img
                src={crust.image}
                alt={crust.name}
                className="w-full h-48 object-cover"
              />
              {selections.crust === crust.id && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white rounded-full p-2">
                  <Check className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="p-6 bg-white">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{crust.name}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{crust.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSizeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pick Your Size</h3>
        <p className="text-gray-600">How hungry are you today?</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sizeOptions.map((size) => (
          <div
            key={size.id}
            onClick={() => handleSelection('size', size.id)}
            className={`
              cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105
              ${selections.size === size.id 
                ? 'ring-4 ring-primary-500 shadow-2xl' 
                : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-primary-300 shadow-lg'
              }
            `}
          >
            <div className="relative bg-gradient-to-br from-primary-50 to-orange-50 p-6">
              <div className="text-center">
                <div className="relative mx-auto mb-4" style={{ width: `${parseInt(size.id) * 4}px`, height: `${parseInt(size.id) * 4}px` }}>
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full border-4 border-orange-400 shadow-lg"></div>
                  <div className="absolute inset-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full"></div>
                </div>
                <h4 className="text-lg font-bold text-gray-900">{size.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{size.diameter}</p>
                <p className="text-xs text-gray-500 mb-3">{size.servings}</p>
                <div className="text-xl font-black text-primary-600">
                  PKR {selections.crust ? size.price[selections.crust]?.toLocaleString() : 'N/A'}
                </div>
              </div>
              {selections.size === size.id && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSauceStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Sauce</h3>
        <p className="text-gray-600">Choose your flavor adventure</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sauceOptions.map((sauce) => (
          <div
            key={sauce.id}
            onClick={() => handleSelection('sauce', sauce.id)}
            className={`
              cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105
              ${selections.sauce === sauce.id 
                ? 'ring-4 ring-primary-500 shadow-2xl' 
                : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-primary-300 shadow-lg'
              }
            `}
          >
            <div className="relative">
              <img
                src={sauce.image}
                alt={sauce.name}
                className="w-full h-48 object-cover"
              />
              {selections.sauce === sauce.id && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white rounded-full p-2">
                  <Check className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-900">{sauce.name}</h4>
                <div className="text-xs">{getSpiceIndicator(sauce.spiceLevel)}</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{sauce.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderToppingsStep = () => {
    const meatToppings = toppingOptions.filter(t => t.category === 'meat');
    const vegToppings = toppingOptions.filter(t => t.category === 'vegetable');
    const cheeseToppings = toppingOptions.filter(t => t.category === 'cheese');

    const renderToppingCategory = (title: string, toppings: ToppingOption[], icon: string) => (
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          {title}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {toppings.map((topping) => (
            <div
              key={topping.id}
              onClick={() => handleSelection('toppings', topping.id)}
              className={`
                cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105
                ${selections.toppings.includes(topping.id)
                  ? 'ring-2 ring-primary-500 shadow-lg bg-primary-50' 
                  : 'ring-1 ring-gray-200 hover:ring-primary-300 shadow-sm bg-white'
                }
              `}
            >
              <div className="relative">
                <img
                  src={topping.image}
                  alt={topping.name}
                  className="w-full h-24 object-cover"
                />
                {selections.toppings.includes(topping.id) && (
                  <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h5 className="font-semibold text-gray-900 text-sm mb-1">{topping.name}</h5>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{topping.description}</p>
                <p className="text-sm font-bold text-primary-600">+PKR {topping.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Your Toppings</h3>
          <p className="text-gray-600">Make it uniquely yours! (Optional)</p>
          {selections.toppings.length > 0 && (
            <p className="text-sm text-primary-600 mt-2">
              {selections.toppings.length} topping{selections.toppings.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>
        
        {renderToppingCategory('Meat', meatToppings, '🥩')}
        {renderToppingCategory('Vegetables', vegToppings, '🥬')}
        {renderToppingCategory('Cheese', cheeseToppings, '🧀')}
      </div>
    );
  };

  const renderPreview = () => {
    const selectedCrust = crustOptions.find(c => c.id === selections.crust);
    const selectedSize = sizeOptions.find(s => s.id === selections.size);
    const selectedSauce = sauceOptions.find(s => s.id === selections.sauce);
    const selectedToppings = toppingOptions.filter(t => selections.toppings.includes(t.id));

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-2 sm:p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[98vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Your Custom Pizza</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Pizza Visual */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full border-4 sm:border-8 border-orange-400 shadow-xl">
                  <div className="absolute inset-2 sm:inset-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                    <div className="text-white text-2xl sm:text-4xl">🍕</div>
                  </div>
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Custom {selectedSize?.name} {selectedCrust?.name} Pizza
              </h4>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Crust:</span>
                <span className="text-gray-900">{selectedCrust?.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Size:</span>
                <span className="text-gray-900">{selectedSize?.name} ({selectedSize?.diameter})</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Sauce:</span>
                <span className="text-gray-900">{selectedSauce?.name}</span>
              </div>
              {selectedToppings.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 block mb-2">Toppings:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedToppings.map(topping => (
                      <span key={topping.id} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {topping.name} (+PKR {topping.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Total Price */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary-600">PKR {calculatePrice().toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors touch-manipulation min-h-[48px]"
              >
                Continue Editing
              </button>
              <button
                onClick={addToCart}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center space-x-2 touch-manipulation min-h-[48px]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return renderCrustStep();
      case 1: return renderSizeStep();
      case 2: return renderSauceStep();
      case 3: return renderToppingsStep();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-6xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-orange-50">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0 flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 truncate">Create Your Own Pizza</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Build your perfect pizza, step by step</p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {isSelectionComplete() && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
          
          {renderStepIndicator()}
          
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{steps[currentStep].title}</h3>
            <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            {/* Mobile: Price first */}
            <div className="text-center sm:order-2">
              <div className="text-xl sm:text-2xl font-black text-primary-600">
                PKR {calculatePrice().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Price</div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between sm:order-1 sm:order-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`
                  flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all touch-manipulation min-h-[48px]
                  ${currentStep === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Previous</span>
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={!isSelectionComplete()}
                  className={`
                    flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all touch-manipulation min-h-[48px]
                    ${isSelectionComplete()
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="text-sm sm:text-base">Review Order</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`
                    flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all touch-manipulation min-h-[48px]
                    ${canProceed()
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="text-sm sm:text-base">Next</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPreview && renderPreview()}
    </div>
  );
};

export default CreateYourOwnPizza;