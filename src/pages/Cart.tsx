import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, X, ArrowRight, ShoppingBag, Truck, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { items, totalPrice, updateQuantity, removeItem, addItem, generateItemKey } = useCart();

  const recommendations = [
    {
      id: 'rec1',
      name: 'Garlic Bread',
      price: 6.99,
      image: 'https://images.pexels.com/photos/4397287/pexels-photo-4397287.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'sides',
      rating: 4.8
    },
    {
      id: 'rec2',
      name: 'Coca-Cola (350ml)',
      price: 2.99,
      image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'drinks',
      rating: 4.9
    },
    {
      id: 'rec3',
      name: 'Chicken Wings',
      price: 12.99,
      image: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'sides',
      rating: 4.7
    },
  ];

  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const progressPercentage = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  const handleAddRecommendation = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              Discover our amazing pizzas and start building your perfect order!
            </p>
            <Link
              to="/menu"
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg inline-flex items-center space-x-2 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Browse Menu</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-16 z-40 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Your Cart ({items.length})</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold text-primary-600">
              PKR {(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 4.99)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Desktop Breadcrumb */}
        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Your Cart</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6 pb-8 lg:pb-12">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900">Your Cart</h1>

            {/* Cart Items */}
            <div className="space-y-3 lg:space-y-4 pb-6 lg:pb-8">
              {items.map((item) => {
                const itemKey = generateItemKey(item);
                return (
                  <div key={itemKey} className="bg-white rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="p-4 lg:p-6">
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl lg:rounded-2xl"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                          {item.options && (
                            <div className="text-xs lg:text-sm text-gray-600 mt-1 space-y-0.5">
                              {item.options.size && <p>Size: <span className="font-medium">{item.options.size}</span></p>}
                              {item.options.crust && <p>Crust: <span className="font-medium">{item.options.crust}</span></p>}
                              {item.options.veggies?.length > 0 && (
                                <p>Veggies: <span className="font-medium">{item.options.veggies.join(', ')}</span></p>
                              )}
                              {item.options.toppings?.length > 0 && (
                                <p>Toppings: <span className="font-medium">{item.options.toppings.join(', ')}</span></p>
                              )}
                            </div>
                          )}
                          <p className="text-primary-600 font-bold mt-2 text-sm lg:text-base">PKR {item.price.toFixed(2)} each</p>
                        </div>

                        {/* Remove Button - Mobile Top Right */}
                        <button
                          onClick={() => removeItem(itemKey)}
                          className="lg:hidden p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Mobile Quantity and Total Row */}
                      <div className="flex items-center justify-between mt-4 lg:hidden">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          
                          <span className="w-8 text-center text-gray-900 font-semibold">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-primary-600" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            PKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Desktop Layout - Quantity Controls */}
                      <div className="hidden lg:flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          
                          <span className="w-12 text-center text-gray-900 font-semibold text-lg">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="w-10 h-10 rounded-full border-2 border-primary-200 bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-primary-600" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              PKR {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(itemKey)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            <div className="mt-8 lg:mt-12 pb-6 lg:pb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                🔥 Popular Add-ons
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {recommendations.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 lg:h-36 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-bold text-sm lg:text-base">PKR {item.price}</span>
                        <button
                          onClick={() => handleAddRecommendation(item)}
                          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Free Shipping Progress */}
              {remainingForFreeShipping > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      <span className="font-bold">PKR {remainingForFreeShipping.toFixed(2)} away</span> from FREE shipping
                    </p>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {totalPrice >= freeShippingThreshold && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 font-semibold">
                      🎉 FREE shipping unlocked!
                    </p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>PKR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={totalPrice >= freeShippingThreshold ? 'text-green-600 font-medium' : ''}>
                    {totalPrice >= freeShippingThreshold ? 'FREE' : 'PKR 4.99'}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>
                      PKR {(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 4.99)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-2xl font-semibold text-center flex items-center justify-center space-x-2 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <Link
                  to="/menu"
                  className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold text-center block hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Continue Shopping
                </Link>

                <button className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-2xl font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Google Pay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Checkout Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
            <button
              onClick={() => {
                // Clear all items from cart
                items.forEach((item) => {
                  const itemKey = generateItemKey(item);
                  removeItem(itemKey);
                });
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Clear cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress - Mobile */}
          {remainingForFreeShipping > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-800">
                    <span className="font-bold">PKR {remainingForFreeShipping.toFixed(2)}</span> for FREE shipping
                  </p>
                </div>
              </div>
              <div className="w-full bg-green-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {totalPrice >= freeShippingThreshold && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-center space-x-2">
                <Truck className="h-4 w-4 text-green-600" />
                <p className="text-green-800 font-semibold text-sm">
                  🎉 FREE shipping!
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Link
              to="/menu"
              className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-center hover:bg-gray-50 transition-colors text-sm"
            >
              Add More
            </Link>
            <Link
              to="/checkout"
              className="flex-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold text-center flex items-center justify-center space-x-2 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg text-sm"
            >
              <span>Checkout PKR {(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 4.99)).toFixed(2)}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="lg:hidden h-32"></div>
      </div>
    </div>
  );
};

export default Cart;