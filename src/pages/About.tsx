import React from 'react';
import { Award, Users, Heart, Target, Zap, Crown, Phone, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us - Big Boss Pizza</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover the passion behind every slice
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Sticky Image */}
          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <img
                src="https://svgpmbhocwhcnqmyuhzv.supabase.co/storage/v1/object/public/menu/Fish%20and%20chips.png"
                alt="Big Boss Pizza Story"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Iftikhar Tahir</h3>
                <p className="text-lg opacity-90">CEO & Founder</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">THE BIG BOSS VISION</h2>
              
              <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                <p className="text-2xl font-bold text-primary-600 text-center py-4 border-l-4 border-primary-600 pl-4">
                  At Big Boss Pizza, we don't serve old tales — we serve the future of pizza, hot and fresh.
                </p>

                <p>
                  Our goal is clear:
                </p>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="h-6 w-6 text-orange-600" />
                    <span className="text-lg font-bold text-gray-900">👉 To become Pakistan's fastest-growing pizza franchise, opening 25 branches in the next 10 years.</span>
                  </div>
                </div>

                <p>
                  We're on a mission to serve pizzas made with freshly prepared dough, premium cheese, garden-fresh vegetables, and our signature organic sauces — delivering the perfect balance of flavor, freshness, and satisfaction.
                </p>

                <p className="text-xl font-semibold text-gray-800 text-center py-4">
                  But Big Boss Pizza is more than food.
                </p>

                <p className="text-xl font-semibold text-gray-800 text-center py-4">
                  It's an idea.
                </p>

                <p className="text-2xl font-bold text-primary-600 text-center py-4">
                  A belief that everyone can "Be Your Own Big Boss."
                </p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-red-600" />
                    <span>Our Promise</span>
                  </h3>
                  <p className="text-gray-700">
                    Every pizza we serve is crafted with the same passion and dedication that drives us to be the best. From our kitchen to your table, we ensure that every bite delivers the authentic taste of Italy with a Pakistani twist.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <span className="text-gray-700 font-medium">+92 21 1234 5678</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <span className="text-gray-700 font-medium">info@bigbosspizza.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">25</div>
                <div className="text-gray-600">Branches Target</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">10</div>
                <div className="text-gray-600">Years Vision</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">1M+</div>
                <div className="text-gray-600">Pizzas Served</div>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality First</h4>
                    <p className="text-gray-600">We never compromise on ingredients or preparation methods.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Authentic Experience</h4>
                    <p className="text-gray-600">Every pizza tells a story of tradition and craftsmanship.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Customer Family</h4>
                    <p className="text-gray-600">We treat every customer like a member of our family.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Innovation</h4>
                    <p className="text-gray-600">We blend traditional methods with modern techniques.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Boss Mentality</h4>
                    <p className="text-gray-600">We empower everyone to be their own boss through quality and service.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;