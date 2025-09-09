import React, { useState } from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  const quickLinks = [
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/about' },
    { name: 'Locations', href: '/branches' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Section - Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
              <div className="space-y-2">
                <p className="text-gray-300">📞 Phone: <a href="tel:+92211234567" className="hover:text-white transition-colors">+92 21 1234 5678</a></p> 
                <p className="text-gray-300">✉️ Email: <a href="https://mail.google.com/mail/u/0/?view=cm&to=info@bigbosspizza.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">info@bigbosspizza.com</a></p>
                <p className="text-gray-300">📍 Location: Safa Heights, Precinct 11A Commercial, Bahria Town Karachi</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <div className="h-5 w-5 bg-gradient-to-r from-pink-500 to-red-500 rounded flex items-center justify-center text-xs font-bold">
                    T
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Hours</h3>
              <p className="text-gray-300">Mon–Sun: 5 PM–03 AM</p>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-white transition-colors py-1 touch-manipulation"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get special offers and updates!
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-base"
                required
              />
              <button
                type="submit"
                className="w-full btn-primary text-white py-3 px-4 rounded-md font-medium touch-manipulation"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 Big Boss Pizza. Powered by{' '}
            <a
              href="https://krynoixtech.com"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              krynoixtech.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;