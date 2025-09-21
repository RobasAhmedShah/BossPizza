import React, { useState } from 'react';
import { Search, MapPin, Phone, Clock, Plus, Minus, AlertCircle } from 'lucide-react';

const Branches: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [mapZoom, setMapZoom] = useState(12);

  const cities = [
    'Karachi',
    'Hyderabad',
    'Lahore',
    'Islamabad',
    'Quetta'
    'Faisalabad'
    'Peshawar'
    'Dipalpur'
  ];

  const branches = [
    {
      id: 1,
      name: 'Big Boss Pizza - Bahria Town',
      address: 'Safa Heights, Precinct 11A Commercial, Bahria Town Karachi',
      city: 'Karachi',
      phone: '+92 21 1234 5678',
      hours: 'Mon-Sun: 5 PM - 12 AM',
      coordinates: { lat: 25.0582, lng: 67.3146 }, // 25°03'29.7"N 67°18'52.7"E
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'available'
    },
    {
      id: 2,
      name: 'Big Boss Pizza - Quetta Central',
      address: 'Jinnah Road, Quetta, Pakistan',
      city: 'Quetta',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 30.1798, lng: 66.9750 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    },
    // Coming Soon Branches
    {
      id: 3,
      name: 'Big Boss Pizza - Karachi (Coming Soon)',
      address: 'Karachi, Pakistan',
      city: 'Karachi',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 24.8607, lng: 67.0011 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    },
    {
      id: 4,
      name: 'Big Boss Pizza - Hyderabad (Coming Soon)',
      address: 'Hyderabad, Pakistan',
      city: 'Hyderabad',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 25.3960, lng: 68.3578 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    },
    {
      id: 5,
      name: 'Big Boss Pizza - Lahore (Coming Soon)',
      address: 'Lahore, Pakistan',
      city: 'Lahore',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 31.5204, lng: 74.3587 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    },
    {
      id: 6,
      name: 'Big Boss Pizza - Islamabad (Coming Soon)',
      address: 'Islamabad, Pakistan',
      city: 'Islamabad',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 33.6844, lng: 73.0479 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    }
    {
      id: 6,
      name: 'Big Boss Pizza - Peshawar (Coming Soon)',
      address: 'Peshawar, Pakistan',
      city: 'Peshawar',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 33.6844, lng: 73.0479 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    }
  {
      id: 6,
      name: 'Big Boss Pizza - Depalpur (Coming Soon)',
      address: 'Depalpur, Pakistan',
      city: 'Depalpur',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 33.6844, lng: 73.0479 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    }
  {
      id: 6,
      name: 'Big Boss Pizza - Faisalabad (Coming Soon)',
      address: 'Faisalabad, Pakistan',
      city: 'Faisalabad',
      phone: 'Coming Soon',
      hours: 'Coming Soon',
      coordinates: { lat: 33.6844, lng: 73.0479 },
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'coming-soon'
    }
  ];

  const filteredBranches = branches.filter(branch => {
    const matchesCity = !selectedCity || branch.city === selectedCity;
    const matchesSearch = !searchTerm || 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleViewDetails = (branch: any) => {
    // Disable interactive map for coming-soon branches
    if (branch.status === 'coming-soon') {
      setSelectedBranch(null);
      return;
    }
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
                  } ${branch.status === 'coming-soon' ? 'opacity-75' : ''}`}
                  onClick={() => handleViewDetails(branch)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      branch.status === 'coming-soon' ? 'bg-yellow-100' : 'bg-primary-100'
                    }`}>
                      {branch.status === 'coming-soon' ? (
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <MapPin className="h-6 w-6 text-primary-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {branch.name}
                        </h3>
                        {branch.status === 'coming-soon' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
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
                      
                      <div className="mt-3 flex items-center space-x-3">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View Details
                        </button>
                        
                        {branch.status !== 'coming-soon' && (
                          <>
                            <span className="text-gray-300">•</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const { lat, lng } = branch.coordinates;
                                const address = encodeURIComponent(branch.address);
                                
                                // Check if user is on mobile device
                                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                
                                let mapsUrl;
                                if (isMobile) {
                                  // Mobile: Try to open native maps app, fallback to web
                                  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                                    // iOS: Try Apple Maps first, fallback to Google Maps
                                    mapsUrl = `maps://?q=${lat},${lng}&ll=${lat},${lng}`;
                                    window.location.href = mapsUrl;
                                    
                                    // Fallback to Google Maps after a short delay
                                    setTimeout(() => {
                                      window.open(`https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`, '_blank');
                                    }, 500);
                                  } else {
                                    // Android: Google Maps
                                    mapsUrl = `geo:${lat},${lng}?q=${lat},${lng}(${address})`;
                                    window.location.href = mapsUrl;
                                    
                                    // Fallback to web Google Maps
                                    setTimeout(() => {
                                      window.open(`https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`, '_blank');
                                    }, 500);
                                  }
                                } else {
                                  // Desktop: Open Google Maps in new tab
                                  mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`;
                                  window.open(mapsUrl, '_blank');
                                }
                              }}
                              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                            >
                              <MapPin className="h-3 w-3" />
                              <span>Directions</span>
                            </button>
                          </>
                        )}
                      </div>
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
              <div className="relative h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
                {/* Google Maps Embed */}
                {selectedBranch ? (
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.2234567890123!2d${selectedBranch.coordinates.lng}!3d${selectedBranch.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDAzJzI5LjciTiA2N8KwMTgnNTIuNyJF!5e0!3m2!1sen!2spk!4v1620000000000!5m2!1sen!2spk&zoom=${mapZoom}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map showing ${selectedBranch.name}`}
                  />
                ) : null}
                
                {/* Branch Info Overlay */}
                {selectedBranch && (
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedBranch.status === 'coming-soon' ? 'bg-yellow-500' : 'bg-primary-600'
                      }`}>
                        {selectedBranch.status === 'coming-soon' ? (
                          <AlertCircle className="h-5 w-5 text-white" />
                        ) : (
                          <MapPin className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{selectedBranch.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{selectedBranch.address}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{selectedBranch.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{selectedBranch.hours}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            Coordinates: {selectedBranch.coordinates.lat.toFixed(4)}°N, {selectedBranch.coordinates.lng.toFixed(4)}°E
                          </div>
                        </div>
                        {selectedBranch.status === 'coming-soon' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <p className="text-yellow-800 font-medium">🚧 Coming Soon</p>
                          </div>
                        )}
                        
                        {/* Get Directions Button */}
                        {selectedBranch.status !== 'coming-soon' && (
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                const { lat, lng } = selectedBranch.coordinates;
                                const address = encodeURIComponent(selectedBranch.address);
                                
                                // Check if user is on mobile device
                                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                
                                let mapsUrl;
                                if (isMobile) {
                                  // Mobile: Try to open native maps app, fallback to web
                                  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                                    // iOS: Try Apple Maps first, fallback to Google Maps
                                    mapsUrl = `maps://?q=${lat},${lng}&ll=${lat},${lng}`;
                                    window.location.href = mapsUrl;
                                    
                                    // Fallback to Google Maps after a short delay
                                    setTimeout(() => {
                                      window.open(`https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`, '_blank');
                                    }, 500);
                                  } else {
                                    // Android: Google Maps
                                    mapsUrl = `geo:${lat},${lng}?q=${lat},${lng}(${address})`;
                                    window.location.href = mapsUrl;
                                    
                                    // Fallback to web Google Maps
                                    setTimeout(() => {
                                      window.open(`https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`, '_blank');
                                    }, 500);
                                  }
                                } else {
                                  // Desktop: Open Google Maps in new tab
                                  mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`;
                                  window.open(mapsUrl, '_blank');
                                }
                              }}
                              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
                            >
                              <MapPin className="h-3 w-3" />
                              <span>Get Directions</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;
