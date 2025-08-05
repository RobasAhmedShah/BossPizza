import React, { useState } from 'react';
import { Search, MapPin, Phone, Clock, Plus, Minus } from 'lucide-react';

const Branches: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [mapZoom, setMapZoom] = useState(12);

  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
  ];

  const branches = [
    {
      id: 1,
      name: 'Big Boss Pizza - Times Square',
      address: '1234 Broadway, New York, NY 10001',
      city: 'New York',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Sun: 11 AM - 11 PM',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: 'Big Boss Pizza - Brooklyn Heights',
      address: '567 Atlantic Ave, Brooklyn, NY 11217',
      city: 'New York',
      phone: '+1 (555) 234-5678',
      hours: 'Mon-Sun: 11 AM - 12 AM',
      coordinates: { lat: 40.6892, lng: -73.9942 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: 'Big Boss Pizza - Hollywood',
      address: '890 Sunset Blvd, Los Angeles, CA 90028',
      city: 'Los Angeles',
      phone: '+1 (555) 345-6789',
      hours: 'Mon-Sun: 10 AM - 1 AM',
      coordinates: { lat: 34.0928, lng: -118.3287 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: 'Big Boss Pizza - Santa Monica',
      address: '321 Ocean Ave, Santa Monica, CA 90401',
      city: 'Los Angeles',
      phone: '+1 (555) 456-7890',
      hours: 'Mon-Sun: 11 AM - 11 PM',
      coordinates: { lat: 34.0195, lng: -118.4912 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      name: 'Big Boss Pizza - Downtown Chicago',
      address: '456 Michigan Ave, Chicago, IL 60611',
      city: 'Chicago',
      phone: '+1 (555) 567-8901',
      hours: 'Mon-Sun: 11 AM - 10 PM',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const filteredBranches = branches.filter(branch => {
    const matchesCity = !selectedCity || branch.city === selectedCity;
    const matchesSearch = !searchTerm || 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleViewDetails = (branch: any) => {
    setSelectedBranch(branch);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Our Locations</h1>
          <p className="text-gray-600 mt-2">Find a Big Boss Pizza near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[600px]">
          {/* Left Panel - Search & Branches */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Select City
                  </label>
                  <select
                    id="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Branch
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="search"
                      placeholder="Search Branch"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Branch List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className={`bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedBranch?.id === branch.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                  }`}
                  onClick={() => handleViewDetails(branch)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {branch.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{branch.address}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{branch.hours}</span>
                        </div>
                      </div>
                      
                      <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBranches.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
              {/* Map Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Store Locations</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMapZoom(Math.min(18, mapZoom + 1))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setMapZoom(Math.max(8, mapZoom - 1))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Map Content */}
              <div className="relative h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                {/* Simulated Map */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-12 w-12 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedBranch ? `Showing: ${selectedBranch.name}` : 'Select a branch to view on map'}
                  </p>
                  
                  {selectedBranch && (
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
                      <img
                        src={selectedBranch.image}
                        alt={selectedBranch.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-gray-900 mb-1">{selectedBranch.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{selectedBranch.address}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{selectedBranch.phone}</span>
                        <span>{selectedBranch.hours}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map Pins */}
                {filteredBranches.map((branch, index) => (
                  <div
                    key={branch.id}
                    className={`absolute w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${
                      selectedBranch?.id === branch.id ? 'ring-4 ring-primary-200 scale-110' : ''
                    }`}
                    style={{
                      left: `${20 + (index % 3) * 30}%`,
                      top: `${30 + Math.floor(index / 3) * 25}%`,
                    }}
                    onClick={() => handleViewDetails(branch)}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;