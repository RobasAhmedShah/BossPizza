import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Clock, Truck, Play, ArrowRight, Flame, Zap, Send, User, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useMenu } from '../hooks/useMenu';

import ScrollReveal from '../components/ui/ScrollReveal';
import ParallaxSection from '../components/ui/ParallaxSection';

const Home: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      rating: 5,
      comment: "Best pizza I've ever had! The crust is perfectly crispy and the toppings are fresh. Big Boss Pizza is now my go-to place!",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      rating: 5,
      comment: "Amazing service and even better food! The delivery was super fast and the pizza was still hot. Highly recommend!",
      date: "2024-01-12"
    },
    {
      id: 3,
      name: "Muhammad Ali",
      rating: 4,
      comment: "Great quality pizza with generous toppings. The prices are reasonable for the portion size. Will definitely order again!",
      date: "2024-01-10"
    }
  ]);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addItem } = useCart();

  const { menuItems, isLoading } = useMenu();

  const banners = [
    'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  // Get top selling items from database
  const getTopSellingItems = () => {
    const signaturePizzas = menuItems['signature-pizzas'] || [];
    return signaturePizzas
      .filter(item => item.is_popular)
      .slice(0, 4)
      .map(item => ({
        id: item.id,
        name: item.name,
        image: item.image_url,
        price: Math.min(...item.sizes.map(s => s.price)),
        category: item.category.slug,
        sizes: item.sizes
      }));
  };

  // Get menu preview items (6 items in 2x3 grid)
  const getMenuPreviewItems = () => {
    const allItems = Object.values(menuItems).flat();
    return allItems
      .filter(item => item.is_available)
      .slice(0, 6)
      .map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image_url,
        price: Math.min(...item.sizes.map(s => s.price)),
        category: item.category.slug,
        rating: item.rating,
        sizes: item.sizes
      }));
  };

  const topSelling = getTopSellingItems();
  const menuPreview = getMenuPreviewItems();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAddToCart = (item: any) => {
    // For items with multiple sizes, use the smallest size
    const selectedSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : null;
    
    addItem({
      id: item.id,
      name: item.name,
      price: selectedSize ? selectedSize.price : item.price,
      image: item.image,
      category: item.category,
      options: selectedSize ? {
        size: selectedSize.size_name,
        price: selectedSize.price
      } : undefined
    });
  };

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please fill in all fields and select a rating');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const review = {
        id: Date.now(),
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ name: '', rating: 0, comment: '' });
      setShowReviewForm(false);
      setIsSubmitting(false);
      
      // Show success message
      alert('Thank you for your review! It has been submitted successfully.');
    }, 1000);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Floating Pepperoni */}
        <div 
          className="absolute w-8 h-8 bg-red-600 rounded-full opacity-20 animate-bounce"
          style={{
            left: `${20 + Math.sin(Date.now() * 0.001) * 10}%`,
            top: `${30 + Math.cos(Date.now() * 0.001) * 5}%`,
            animationDelay: '0s',
            animationDuration: '3s'
          }}
        />
        <div 
          className="absolute w-6 h-6 bg-red-500 rounded-full opacity-15 animate-bounce"
          style={{
            right: `${15 + Math.sin(Date.now() * 0.0015) * 8}%`,
            top: `${60 + Math.cos(Date.now() * 0.0015) * 6}%`,
            animationDelay: '1s',
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute w-10 h-10 bg-yellow-400 rounded-full opacity-10 animate-bounce"
          style={{
            left: `${70 + Math.sin(Date.now() * 0.0008) * 12}%`,
            bottom: `${20 + Math.cos(Date.now() * 0.0008) * 8}%`,
            animationDelay: '2s',
            animationDuration: '5s'
          }}
        />
      </div>

      {/* Modern Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #dc2626 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, #ea580c 0%, transparent 50%)`,
            animation: 'pulse 4s ease-in-out infinite'
          }} />
        </div>

        {/* Parallax Mouse Effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-40 right-32 w-40 h-40 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur-3xl opacity-15" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
            
            {/* Left Content - Asymmetrical Layout */}
            <div className="lg:col-span-7 space-y-8 lg:space-y-10">
              {/* Social Proof Badges */}
              <div className={`flex flex-wrap gap-4 mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              </div>

         {/* Oversized Bold Headlines */}
<div className="space-y-3">
  <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-none">
      <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
        BIG
      </span>
      <span className="block bg-gradient-to-r from-yellow-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
        BOSS
      </span>
      <span className="block text-white relative">
        PIZZA
        <div className="absolute -top-3 -right-6 animate-bounce">
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
      </span>
    </h1>
  </div>
  <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
    <p className="text-sm sm:text-lg lg:text-xl font-light text-gray-300 max-w-xl">
      <span className="text-orange-400 font-semibold">LEGENDARY</span> flavors that are 
      <span className="text-red-400 font-semibold"> BOSS-SIZED</span> and 
      <span className="text-yellow-400 font-semibold"> EPIC</span>
    </p>
  </div>
  <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
    <p className="text-sm text-gray-400 max-w-md leading-relaxed">
      Handcrafted since 1985 • Authentic Italian Experience • Game-changing flavors that'll make you the boss of your taste buds
    </p>
  </div>
</div>
{/* Enhanced Action Buttons */}
<div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
  <Link
    to="/menu"
    className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
  >
    <span className="relative z-10 flex items-center justify-center space-x-2">
      <span>ORDER NOW</span>
      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
  <Link
    to="/menu"
    className="group bg-transparent border-2 border-white/30 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
  >
    <span className="flex items-center justify-center space-x-2">
      <span>VIEW MENU</span>
      <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
    </span>
  </Link>
</div>
</div>
            {/* Right Content - Pizza Showcase */}
            <div className="lg:col-span-5 relative">
              <div className={`transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-20 rotate-12'}`}>
                <div className="relative">
                  {/* Main Pizza Image */}
                  <div className="relative w-full max-w-lg mx-auto">
                    <div className="aspect-square rounded-full overflow-hidden shadow-2xl border-8 border-white/20 backdrop-blur-sm">
                      {!isVideoPlaying ? (
                        <div className="relative h-full">
                          {banners.map((banner, index) => (
                            <div
                              key={index}
                              className={`absolute inset-0 transition-all duration-1000 ${
                                index === currentBanner ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                              }`}
                            >
                              <img
                                src={banner}
                                alt={`Pizza ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading={index === 0 ? 'eager' : 'lazy'}
                              />
                            </div>
                          ))}
                          
                          {/* Play Button Overlay */}
                          <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
                          >
                            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                              <Play className="h-10 w-10 text-red-600 ml-1" />
                            </div>
                          </button>
                        </div>
                      ) : (
                        <video
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                          onLoadStart={() => setIsVideoPlaying(true)}
                        >
                          <source src="https://static.vecteezy.com/system/resources/previews/002/177/688/mp4/italian-pizza-near-fire-free-video.mp4" type="video/mp4" />
                        </video>
                      )}
                    </div>

                   
                  

                    {/* Steam Effect */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-8 bg-white/40 rounded-full animate-pulse"
                            style={{
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: '2s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="relative w-full h-full">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        🍅
                      </div>
                      <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        🧀
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-x-8 -translate-y-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        🌿
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              {!isVideoPlaying && (
                <div className="flex justify-center mt-8 space-x-3">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        index === currentBanner 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 scale-125' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Our Top Selling - Enhanced */}
      <ParallaxSection speed={0.3} className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-6">
              <Flame className="h-6 w-6 animate-bounce" />
              <span>LEGENDARY BESTSELLERS</span>
              <Flame className="h-6 w-6 animate-bounce" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                BOSS-SIZED
              </span>
              <br />
              <span className="text-white">FAVORITES</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              These game-changing pizzas have conquered taste buds across the nation
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              // Loading skeletons - Updated to match new white card style
              Array.from({ length: 4 }).map((_, index) => (
                <ScrollReveal key={index} delay={index * 150}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="w-full aspect-[4/3] bg-gray-200"></div>
                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="h-6 w-20 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-20 h-11 bg-gray-200 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : topSelling.length > 0 ? (
              topSelling.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 150}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl active:shadow-lg transition-all duration-500 overflow-hidden group hover:-translate-y-1 active:translate-y-0 menu-item-card border border-gray-100 hover:border-primary-300 flex flex-col relative cursor-pointer transform-gpu">
                    {/* Image Section - Same as menu page */}
                    <div className="relative overflow-hidden bg-gray-50 w-full aspect-[4/3]" style={{ contain: 'layout' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 menu-item-image"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback placeholder */}
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">🍕</span>
                      </div>
                      
                      {/* Enhanced overlay with better gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" />
                      
                      {/* Bestseller Badge - Special styling for top selling items */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1.5 rounded-full shadow-lg">
                        <span className="text-xs font-bold flex items-center space-x-1">
                          <span>🏆</span>
                          <span>#{index + 1} BESTSELLER</span>
                        </span>
                      </div>

                      {/* Popular Badge for consistency */}
                      {menuItems[item.category]?.find(menuItem => menuItem.id === item.id)?.is_popular && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-xs font-bold flex items-center space-x-1">
                            <span>🔥</span>
                            <span>POPULAR</span>
                          </span>
                        </div>
                      )}
                      
                      {/* Quick add button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="bg-white/95 backdrop-blur-sm text-primary-600 p-3 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content Section - Foodpanda style */}
                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                      <div className="flex-1 mb-3">
                        <h3 className="font-bold text-gray-900 mb-2 leading-tight text-base sm:text-lg">
                          {item.name}
                        </h3>
                        
                        {/* Bestseller tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            Top Seller
                          </span>
                          {menuItems[item.category]?.find(menuItem => menuItem.id === item.id)?.is_popular && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Price and Add Button - Foodpanda style */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex-1">
                          {/* Price display */}
                          <div className="flex items-baseline space-x-2">
                            <span className="font-bold text-primary-600 text-lg sm:text-xl">
                              PKR {item.price.toLocaleString()}
                            </span>
                            {item.sizes.length > 1 && (
                              <span className="text-xs text-gray-500 font-medium">onwards</span>
                            )}
                          </div>
                          
                          {/* Delivery time estimate */}
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">25-30 min</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 px-3 py-2.5 min-h-[44px] hover:scale-105 group/btn"
                        >
                          {/* Animated background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                          
                          <Plus className="relative z-10 transition-transform duration-200 h-4 w-4 group-hover/btn:rotate-90" />
                          <span className="relative z-10 text-sm font-bold">
                            {item.sizes.length > 1 ? 'Choose' : 'Add'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : (
              // Fallback content
              <div className="col-span-4 text-center py-8">
                <p className="text-white text-lg">Loading our bestsellers...</p>
              </div>
            )}
          </div>
        </div>
      </ParallaxSection>

      {/* Menu Preview - 2x3 Grid Layout */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                EPIC
              </span>
              <br />
              <span className="text-white">MENU</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover flavors that'll make you the boss of your cravings
            </p>
          </ScrollReveal>

          {/* 2x3 Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              // Loading skeletons for 6 items - Updated to match new white card style
              Array.from({ length: 6 }).map((_, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="w-full aspect-[4/3] sm:aspect-[3/2] bg-gray-200"></div>
                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-1">
                          <div className="h-6 w-20 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-20 h-11 bg-gray-200 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : menuPreview.length > 0 ? (
              menuPreview.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 100}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl active:shadow-lg transition-all duration-500 overflow-hidden group hover:-translate-y-1 active:translate-y-0 menu-item-card border border-gray-100 hover:border-primary-300 flex flex-col relative cursor-pointer transform-gpu">
                    {/* Image Section - Same as menu page */}
                    <div className="relative overflow-hidden bg-gray-50 w-full aspect-[4/3] sm:aspect-[3/2]" style={{ contain: 'layout' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 menu-item-image"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback placeholder */}
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">🍕</span>
                      </div>
                      
                      {/* Enhanced overlay with better gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" />
                      
                      {/* Rating Badge - Floating design */}
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2.5 py-1.5 flex items-center space-x-1 shadow-lg border border-white/20">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-bold text-white">{item.rating}</span>
                      </div>

                      {/* Popular Badge - Check if item has is_popular property */}
                      {menuItems[item.category]?.find(menuItem => menuItem.id === item.id)?.is_popular && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-xs font-bold flex items-center space-x-1">
                            <span>🔥</span>
                            <span>POPULAR</span>
                          </span>
                        </div>
                      )}
                      
                      {/* Quick add button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="bg-white/95 backdrop-blur-sm text-primary-600 p-3 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content Section - Foodpanda style */}
                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                      <div className="flex-1 mb-3">
                        <h3 className="font-bold text-gray-900 mb-2 leading-tight text-base sm:text-lg lg:text-xl">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        
                        {/* Ingredients/Features tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {menuItems[item.category]?.find(menuItem => menuItem.id === item.id)?.is_popular && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          )}
                          {item.rating >= 4.5 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Top Rated
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Price and Add Button - Foodpanda style */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex-1">
                          {/* Price display */}
                          <div className="flex items-baseline space-x-2">
                            <span className="font-bold text-primary-600 text-lg sm:text-xl">
                              PKR {item.price.toLocaleString()}
                            </span>
                            {item.sizes.length > 1 && (
                              <span className="text-xs text-gray-500 font-medium">onwards</span>
                            )}
                          </div>
                          
                          {/* Delivery time estimate */}
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">25-30 min</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 px-3 py-2.5 min-h-[44px] hover:scale-105 group/btn"
                        >
                          {/* Animated background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                          
                          <Plus className="relative z-10 transition-transform duration-200 h-4 w-4 group-hover/btn:rotate-90" />
                          <span className="relative z-10 text-sm font-bold">
                            {item.sizes.length > 1 ? 'Choose' : 'Add'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : (
              // Fallback content
              <div className="col-span-3 text-center py-8">
                <p className="text-white text-lg">Loading our delicious menu...</p>
              </div>
            )}
          </div>

          <ScrollReveal className="text-center mt-12">
            <Link
              to="/menu"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
            >
              <span>EXPLORE FULL MENU</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Download Our App - Enhanced */}
      <ParallaxSection speed={0.2} className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="space-y-8">
              <div>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm mb-6">
                  <Zap className="h-4 w-4" />
                  <span>DOWNLOAD NOW</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    BIG BOSS
                  </span>
                  <br />
                  <span className="text-white">APP</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Get the ultimate pizza experience with lightning-fast ordering and exclusive boss-level deals
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
                    <p className="text-gray-400">Order in 30 seconds, delivered in 25 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Real-time Tracking</h3>
                    <p className="text-gray-400">Watch your pizza journey from oven to door</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Exclusive Deals</h3>
                    <p className="text-gray-400">Boss-level discounts only for app users</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on App Store"
                  className="h-14 cursor-pointer hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-14 cursor-pointer hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gradient-to-br from-gray-800 to-black rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-600 rounded-[2.5rem] overflow-hidden relative">
                    <img
                      src="https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt="App Preview"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* App UI Elements */}
                    <div className="absolute bottom-8 left-4 right-4 text-white">
                      <h4 className="font-bold text-lg mb-2">Order in 30 seconds</h4>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Boss Special Pizza</span>
                          <span className="font-bold">$24.99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notifications */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-bold animate-bounce">
                  Order Ready!
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-bold animate-bounce" style={{ animationDelay: '0.5s' }}>
                  20% OFF
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #dc2626 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, #ea580c 0%, transparent 50%)`
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-600 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-6">
              <Star className="h-6 w-6" />
              <span>CUSTOMER REVIEWS</span>
              <Star className="h-6 w-6" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-primary-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                WHAT OUR
              </span>
              <br />
              <span className="text-gray-900">BOSSES SAY</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who've experienced the Big Boss difference
            </p>
            
            {/* Overall Rating */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="text-center">
                <div className="text-4xl font-black text-primary-600">{averageRating}</div>
                <div className="flex items-center space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${star <= Math.round(parseFloat(averageRating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
              </div>
            </div>

            {/* Add Review Button */}
            <button
              onClick={() => setShowReviewForm(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Write a Review</span>
            </button>
          </ScrollReveal>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {reviews.map((review, index) => (
              <ScrollReveal key={review.id} delay={index * 100}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  
                  {/* Review Content */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                  
                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{review.rating}/5 stars</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Verified Customer
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className={`p-1 hover:scale-110 transition-transform ${
                            star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className={`h-8 w-8 ${star <= newReview.rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {newReview.rating > 0 ? `${newReview.rating} out of 5 stars` : 'Click to rate'}
                    </p>
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all resize-none"
                      rows={4}
                      placeholder="Share your experience with Big Boss Pizza..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-500 to-orange-500 text-white hover:from-primary-600 hover:to-orange-600 hover:scale-105'
                    } flex items-center justify-center space-x-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* About Us - Split Screen Design */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
            
            {/* Left - Bold Colors/Text */}
            <ScrollReveal direction="left" className="bg-gradient-to-br from-red-600 to-orange-600 p-12 flex items-center">
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                  THE
                  <br />
                  <span className="text-yellow-300">BOSS</span>
                  <br />
                  STORY
                </h2>
                
                <div className="space-y-4 text-white/90 text-lg leading-relaxed">
                  <p>
                    Since 1985, we've been the undisputed champions of pizza perfection. 
                    What started as a small family dream has grown into a legendary empire.
                  </p>
                  
                  <p>
                    Every pizza is a masterpiece, crafted with premium ingredients and 
                    traditional techniques passed down through generations. We don't just 
                    make pizza – we create experiences.
                  </p>
                  
                  <p className="font-bold text-yellow-300">
                    "When you're the boss, you demand the best. That's exactly what we deliver."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-300">40+</div>
                    <div className="text-white/80 text-sm">Years of Excellence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-300">1M+</div>
                    <div className="text-white/80 text-sm">Pizzas Served</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right - Pizza Photography */}
            <ScrollReveal direction="right" className="relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="About Big Boss Pizza"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-red-600/20" />
              
           
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;