import React from 'react';
import { Award, Users, Clock, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
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
                src="https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800"
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              
              <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                <p>
                  At the heart of our pizza journey is our CEO, <strong>Iftikhar Tahir</strong>, a passionate traveler who has explored flavors from the bustling streets of New York to the charming alleys of Rome. Inspired by the authenticity, depth, and culture found in Italian and American pizzerias, he returned to Pakistan with a vision: to create a world-class pizza brand right here at home.
                </p>

                <p className="text-2xl font-bold text-primary-600 text-center py-4">
                  This isn't just another pizza joint. It's a movement.
                </p>

                <p>
                  Every slice we serve is a result of dedication to quality, culture, and authenticity. From hand-stretched dough fermented to perfection, to sauces simmered with herbs imported straight from Italy—our pizzas are not only delicious, they're an experience.
                </p>

                <p>
                  We believe pizza is more than food—it's a cultural celebration. Our interior reflects warmth, our staff greets you like family, and our kitchen? It's where tradition and innovation blend in harmony.
                </p>

                <p>
                  Whether you're a fan of crispy New York-style thin crust, deep-dish goodness, or rustic Italian Margherita, we've got something that'll remind you of your travels—or spark your craving for new ones.
                </p>

                <p>
                  So come in, take a bite, and become a part of a story that's just getting started.
                </p>

                <p className="text-2xl font-bold text-primary-600 text-center py-4">
                  This is not just pizza. This is passion—baked to perfection.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">40+</div>
                <div className="text-gray-600">Years of Excellence</div>
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
                <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
                <div className="text-gray-600">Awards Won</div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;