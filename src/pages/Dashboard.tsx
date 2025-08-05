import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  FileText, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Plus,
  Eye,
  Edit,
  Tag,
  Clock,
  CheckCircle,
  Truck,
  Pizza
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <DashboardHeader />
          <main className="p-8">
            <Routes>
              <Route path="/" element={<OrdersQueue />} />
              <Route path="/orders" element={<OrdersQueue />} />
              <Route path="/drafts" element={<div>Drafts</div>} />
              <Route path="/abandoned" element={<div>Abandoned Checkouts</div>} />
              <Route path="/products" element={<div>Products</div>} />
              <Route path="/customers" element={<div>Customers</div>} />
              <Route path="/analytics" element={<div>Analytics</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Drafts', href: '/dashboard/drafts', icon: FileText },
    { name: 'Abandoned Checkouts', href: '/dashboard/abandoned', icon: ShoppingCart },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Pizza className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">Big Boss Pizza</span>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/dashboard/orders' && location.pathname === '/dashboard');
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const OrdersQueue: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const stats = [
    { name: "Today's Orders", value: '47', change: '+12%', changeType: 'positive' },
    { name: 'Items Ordered', value: '156', change: '+8%', changeType: 'positive' },
    { name: 'Returns', value: '3', change: '-2%', changeType: 'negative' },
    { name: 'Orders Fulfilled', value: '42', change: '+15%', changeType: 'positive' },
    { name: 'Delivered', value: '38', change: '+10%', changeType: 'positive' },
    { name: 'Avg. Fulfillment Time', value: '28 min', change: '-5 min', changeType: 'positive' },
  ];

  const orders = [
    {
      id: '#1001',
      date: '2025-01-15 14:30',
      customer: 'John Smith',
      channel: 'Online',
      total: '$45.99',
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Unfulfilled',
      items: 3,
      deliveryStatus: 'Pending',
      deliveryMethod: 'Delivery',
      tags: ['Priority'],
    },
    {
      id: '#1002',
      date: '2025-01-15 14:25',
      customer: 'Sarah Johnson',
      channel: 'Online',
      total: '$32.50',
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Preparing',
      items: 2,
      deliveryStatus: 'Confirmed',
      deliveryMethod: 'Pickup',
      tags: [],
    },
    {
      id: '#1003',
      date: '2025-01-15 14:20',
      customer: 'Mike Davis',
      channel: 'Phone',
      total: '$67.25',
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Ready',
      items: 4,
      deliveryStatus: 'Out for delivery',
      deliveryMethod: 'Delivery',
      tags: ['Large Order'],
    },
    {
      id: '#1004',
      date: '2025-01-15 14:15',
      customer: 'Emily Wilson',
      channel: 'Online',
      total: '$28.99',
      paymentStatus: 'Pending',
      fulfillmentStatus: 'Unfulfilled',
      items: 2,
      deliveryStatus: 'Pending',
      deliveryMethod: 'Delivery',
      tags: [],
    },
  ];

  const getStatusColor = (status: string, type: 'payment' | 'fulfillment' | 'delivery') => {
    const colors = {
      payment: {
        'Paid': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Failed': 'bg-red-100 text-red-800',
      },
      fulfillment: {
        'Unfulfilled': 'bg-gray-100 text-gray-800',
        'Preparing': 'bg-blue-100 text-blue-800',
        'Ready': 'bg-green-100 text-green-800',
        'Fulfilled': 'bg-green-100 text-green-800',
      },
      delivery: {
        'Pending': 'bg-gray-100 text-gray-800',
        'Confirmed': 'bg-blue-100 text-blue-800',
        'Out for delivery': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
      },
    };
    
    return colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const handleOrderAction = (orderId: string, action: string) => {
    console.log(`${action} order ${orderId}`);
    // Handle order status updates here
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            <div className="flex items-center space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Orders</option>
                <option value="unfulfilled">Unfulfilled</option>
                <option value="unpaid">Unpaid</option>
                <option value="open">Open</option>
                <option value="archived">Archived</option>
              </select>
              
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Create Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-600">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.channel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus, 'payment')}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.fulfillmentStatus, 'fulfillment')}`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.items}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.deliveryStatus, 'delivery')}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.deliveryMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {order.tags.map((tag) => (
                        <span key={tag} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOrderAction(order.id, 'view')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {order.fulfillmentStatus === 'Unfulfilled' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'confirm')}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors"
                          title="Confirm Order"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {order.fulfillmentStatus === 'Ready' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'pickup')}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Mark as Picked Up"
                        >
                          <Truck className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleOrderAction(order.id, 'edit')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit Order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleOrderAction(order.id, 'tag')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Add Tag"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                      
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;