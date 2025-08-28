import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrderTracking } from '../contexts/OrderTrackingContext';
import { ordersAPI, CreateOrderRequest } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import FloatingLabel from '../components/ui/FloatingLabel';
import AnimatedButton from '../components/ui/AnimatedButton';
import ConfirmModal from '../components/ui/ConfirmModal';
import ToastContainer from '../components/ui/ToastContainer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Checkout: React.FC = () => {
  const { items, totalPrice, generateItemKey, clearCart } = useCart();
  const { addActiveOrder } = useOrderTracking();
  const { toasts, addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderProgress, setOrderProgress] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [successOrderNumber, setSuccessOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'Pakistan',
    province: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    shipToDifferent: false,
    orderNotes: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    csc: '',
    agreeTerms: false,
  });

  const [couponCode, setCouponCode] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pakistani cities by province
  const pakistaniCities = {
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas'],
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Nowshera', 'Charsadda'],
    'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman', 'Loralai'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Chilas', 'Astore'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bagh']
  };

  const provinces = Object.keys(pakistaniCities);

  // Address suggestions for autocomplete
  const addressSuggestions = [
    'Block 6, PECHS, Karachi, Pakistan',
    'Gulberg III, Lahore, Pakistan',
    'Blue Area, Islamabad, Pakistan',
    'Jinnah Road, Quetta, Pakistan',
    'University Road, Peshawar, Pakistan',
  ];

  // Calculate totals
  const subtotal = totalPrice;
  const deliveryFee = subtotal >= 2000 ? 0 : 200; // Free delivery over PKR 2000
  const tax = subtotal * 0.15; // 15% tax for Pakistan
  const finalTotal = subtotal + deliveryFee + tax;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    const required = ['firstName', 'lastName', 'province', 'address', 'city', 'postalCode', 'phone', 'email'];
    required.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // ZIP code validation
    if (formData.postalCode && !/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid ZIP code';
    }

    // Payment validation
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!formData.csc) {
        newErrors.csc = 'CSC is required';
      } else if (!/^\d{3,4}$/.test(formData.csc)) {
        newErrors.csc = 'Please enter a valid CSC';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Form Validation Failed',
        message: 'Please fix the errors and try again',
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const processOrder = async () => {
    setIsProcessing(true);
    setOrderProgress(0);

    try {
      // Simulate order processing with progress
      const steps = [
        { message: 'Validating payment...', progress: 25 },
        { message: 'Processing order...', progress: 50 },
        { message: 'Preparing for delivery...', progress: 75 },
        { message: 'Order confirmed!', progress: 100 },
      ];

      // Step 1: Validating payment
      setOrderProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Processing order - Create order in database
      setOrderProgress(50);
      
      // Prepare order data
      const orderData: CreateOrderRequest = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        company: formData.company || undefined,
        delivery_address: {
          street: formData.address,
          city: formData.city,
          state: formData.province,
          zipCode: formData.postalCode,
          country: formData.country
        },
        order_notes: formData.orderNotes || undefined,
        payment_method: formData.paymentMethod,
        cart_items: items.map(item => ({
          item_type: item.category === 'deals' ? 'deal' : 
                    item.id.startsWith('custom-') ? 'custom_pizza' : 'menu_item',
          item_id: item.id,
          item_name: item.name,
          item_description: item.options ? 
            Object.entries(item.options)
              .filter(([key, value]) => key !== 'price' && value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ') : undefined,
          quantity: item.quantity,
          unit_price: item.price,
          customizations: item.options || {}
        }))
      };

      // Create order in database
      const createdOrder = await ordersAPI.createOrder(orderData);
      
      // Add to active orders tracking
      addActiveOrder({
        id: createdOrder.id,
        orderNumber: createdOrder.order_number,
        status: 'confirmed',
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          customizations: item.options ? 
            Object.entries(item.options)
              .filter(([key, value]) => key !== 'price' && value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ') : undefined
        })),
        estimatedDeliveryTime: new Date(createdOrder.estimated_delivery_time || ''),
        totalAmount: createdOrder.total_amount,
        customerName: `${formData.firstName} ${formData.lastName}`,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.province}`,
        createdAt: new Date(createdOrder.created_at)
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Preparing for delivery
      setOrderProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: Order confirmed
      setOrderProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      addToast({
        type: 'success',
        title: `Order ${createdOrder.order_number} Placed Successfully!`,
        message: `Estimated delivery: ${new Date(createdOrder.estimated_delivery_time || '').toLocaleTimeString()}`,
        duration: 5000,
      });

      // Set success state
      setOrderSuccess(true);
      setSuccessOrderNumber(createdOrder.order_number);

      // Clear cart after successful order
      clearCart();

      // Reset form without redirect
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        country: 'Pakistan',
        province: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        email: '',
        shipToDifferent: false,
        orderNotes: '',
        paymentMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        csc: '',
        agreeTerms: false,
      });
      
      // Show success state for a few seconds
      setTimeout(() => {
        setIsProcessing(false);
        setOrderProgress(0);
        setOrderSuccess(false);
        setSuccessOrderNumber('');
      }, 3000);

    } catch (error) {
      console.error('Order creation failed:', error);
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsProcessing(false);
      setOrderProgress(0);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      addToast({
        type: 'success',
        title: 'Coupon Applied!',
        message: '10% discount has been applied to your order',
      });
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'The coupon code you entered is not valid',
      });
    }
  };

  // Redirect to cart if no items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart before checkout</p>
            <Link
              to="/menu"
              className="btn-primary text-white px-8 py-3 rounded-full font-semibold text-lg inline-block"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer toasts={toasts} />
      
      {/* Success Overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-modal-enter">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your order <span className="font-semibold text-primary-600">#{successOrderNumber}</span> has been confirmed.
            </p>
            <p className="text-sm text-gray-500">
              You can track your order in the Active Orders tab above.
            </p>
          </div>
        </div>
      )}
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4">
            <LoadingSpinner 
              progress={orderProgress}
              text={
                orderProgress === 0 ? 'Starting...' :
                orderProgress === 25 ? 'Validating payment...' :
                orderProgress === 50 ? 'Processing order...' :
                orderProgress === 75 ? 'Preparing for delivery...' :
                'Order confirmed!'
              }
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-primary-600 transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Billing & Delivery */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Billing & Delivery Details</h1>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabel
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    error={errors.firstName}
                    required
                  />

                  <FloatingLabel
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    error={errors.lastName}
                    required
                  />
                </div>

                <FloatingLabel
                  label="Company"
                  value={formData.company}
                  onChange={(value) => handleInputChange('company', value)}
                  placeholder="Optional"
                />

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country/Region *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all hover:border-gray-400"
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>

                                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all hover:border-gray-400 ${
                          errors.province ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a province</option>
                        {provinces.map(province => (
                          <optgroup key={province} label={province}>
                            {pakistaniCities[province as keyof typeof pakistaniCities].map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                      )}
                    </div>
                </div>

                <FloatingLabel
                  label="Street Address"
                  value={formData.address}
                  onChange={(value) => handleInputChange('address', value)}
                  error={errors.address}
                  required
                  suggestions={addressSuggestions}
                  onSuggestionSelect={(suggestion) => {
                    const parts = suggestion.split(', ');
                    if (parts.length >= 3) {
                      handleInputChange('address', parts[0]);
                      handleInputChange('city', parts[1]);
                      handleInputChange('province', parts[2].split(' ')[0]);
                    }
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabel
                    label="Town/City"
                    value={formData.city}
                    onChange={(value) => handleInputChange('city', value)}
                    error={errors.city}
                    required
                  />

                  <FloatingLabel
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(value) => handleInputChange('postalCode', value)}
                    error={errors.postalCode}
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabel
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    error={errors.phone}
                    required
                  />

                  <FloatingLabel
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    error={errors.email}
                    required
                  />
                </div>

                {/* Ship to Different Address */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shipToDifferent"
                    checked={formData.shipToDifferent}
                    onChange={(e) => handleInputChange('shipToDifferent', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="shipToDifferent" className="ml-2 text-sm text-gray-700">
                    Ship to a different address?
                  </label>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.orderNotes}
                    onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Details & Payment */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Order</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const itemKey = generateItemKey(item);
                  return (
                    <div key={itemKey} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        {item.options && (
                          <p className="text-xs text-gray-500">
                            {item.options.size && `${item.options.size} | `}
                            {item.options.crust}
                          </p>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        PKR {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span>PKR {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>PKR {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                {!showCoupon ? (
                  <button
                    onClick={() => setShowCoupon(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    Have a coupon? Click here to use
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                    <AnimatedButton
                      onClick={applyCoupon}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Apply
                    </AnimatedButton>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>

                {/* Credit Card */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="paymentCard"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 transition-colors"
                    />
                    <label htmlFor="paymentCard" className="ml-2 flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">Credit Card</span>
                    </label>
                    <div className="ml-auto flex space-x-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                      <div className="w-8 h-5 bg-blue-400 rounded text-white text-xs flex items-center justify-center">AMEX</div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 accordion-content expanded">
                      <FloatingLabel
                        label="Card Number"
                        value={formData.cardNumber}
                        onChange={(value) => handleInputChange('cardNumber', value)}
                        error={errors.cardNumber}
                        required
                        placeholder="1234 5678 9012 3456"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FloatingLabel
                          label="MM/YY"
                          value={formData.expiryDate}
                          onChange={(value) => handleInputChange('expiryDate', value)}
                          error={errors.expiryDate}
                          required
                          placeholder="12/25"
                        />

                        <FloatingLabel
                          label="CSC"
                          value={formData.csc}
                          onChange={(value) => handleInputChange('csc', value)}
                          error={errors.csc}
                          required
                          placeholder="123"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                        />
                        <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                          I agree to the Terms & Conditions *
                        </label>
                      </div>
                      {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms}</p>}
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paymentCash"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 transition-colors"
                    />
                    <label htmlFor="paymentCash" className="ml-2 flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <AnimatedButton
                onClick={handleSubmit}
                className="w-full btn-primary text-white py-4 rounded-xl font-semibold text-lg mt-6 btn-enhanced"
                disabled={isProcessing}
              >
                Place Order - PKR {finalTotal.toFixed(2)}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={processOrder}
        title="Confirm Your Order"
        message={`Are you sure you want to place this order for PKR ${finalTotal.toFixed(2)}?`}
        confirmText="Place Order"
        type="info"
      />
    </div>
  );
};

export default Checkout;