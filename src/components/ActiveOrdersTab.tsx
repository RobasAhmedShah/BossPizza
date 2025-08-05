import React, { useState, useEffect } from 'react';
import { Clock, Package, Truck, CheckCircle, MapPin, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useOrderTracking, ActiveOrder } from '../contexts/OrderTrackingContext';

const ActiveOrdersTab: React.FC = () => {
  const { activeOrders, hasActiveOrders, getTimeRemaining, updateOrderStatus, removeActiveOrder, refreshActiveOrders, isLoading } = useOrderTracking();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});

  // Update timers every second
  useEffect(() => {
    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      const newTimers: Record<string, number> = {};
      activeOrders.forEach(order => {
        newTimers[order.id] = getTimeRemaining(order.id);
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders, hasActiveOrders, getTimeRemaining]);

  // Auto-collapse when no active orders
  useEffect(() => {
    if (!hasActiveOrders) {
      setIsExpanded(false);
    }
  }, [hasActiveOrders]);

  const handleRefresh = async () => {
    await refreshActiveOrders();
  };
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: ActiveOrder['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'preparing':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'ready':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'out_for_delivery':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'arriving_soon':
        return <MapPin className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: ActiveOrder['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Your Order';
      case 'ready':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'arriving_soon':
        return 'Arriving Soon';
      default:
        return 'Processing';
    }
  };

  const getStatusColor = (status: ActiveOrder['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'preparing':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'ready':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'arriving_soon':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!hasActiveOrders) return null;

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg">
      {/* Tab Header */}
      <div 
        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
            <span className="font-semibold text-lg">
              Active Orders ({activeOrders.length})
            </span>
            <div className="hidden sm:flex items-center space-x-4">
              {activeOrders.slice(0, 2).map(order => (
                <div key={order.id} className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-sm font-medium">#{order.orderNumber}</span>
                  <span className="text-sm">
                    {formatTime(timers[order.id] || 0)}
                  </span>
                </div>
              ))}
              {activeOrders.length > 2 && (
                <span className="text-sm opacity-90">+{activeOrders.length - 2} more</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              className={`p-1 hover:bg-white/10 rounded-full transition-colors ${isLoading ? 'animate-spin' : ''}`}
              title="Refresh orders"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <span className="text-sm opacity-90 hidden sm:block">
              {isExpanded ? 'Click to collapse' : 'Click to expand'}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-white border-t border-gray-100 animate-slide-down">
          {isLoading && (
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Refreshing orders...</span>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeActiveOrder(order.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      title="Remove from tracking"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {formatTime(timers[order.id] || 0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {timers[order.id] > 0 ? 'Estimated delivery' : 'Should be delivered'}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{order.deliveryAddress}</span>
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Order Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex-1">
                              <span className="text-gray-900">{item.quantity}x {item.name}</span>
                              {item.customizations && (
                                <p className="text-xs text-gray-500 mt-1">{item.customizations}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total:</span>
                        <span className="font-bold text-primary-600">PKR {order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${
                            order.status === 'confirmed' ? '20%' :
                            order.status === 'preparing' ? '40%' :
                            order.status === 'ready' ? '60%' :
                            order.status === 'out_for_delivery' ? '80%' :
                            order.status === 'arriving_soon' ? '95%' : '100%'
                          }` 
                        }}
                      />
                    </div>

                    {/* Status Update Buttons (Demo) */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {order.status !== 'arriving_soon' && (
                        <button
                          onClick={() => {
                            const nextStatus = 
                              order.status === 'confirmed' ? 'preparing' :
                              order.status === 'preparing' ? 'ready' :
                              order.status === 'ready' ? 'out_for_delivery' :
                              order.status === 'out_for_delivery' ? 'arriving_soon' : order.status;
                            updateOrderStatus(order.id, nextStatus);
                          }}
                          className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOrdersTab;