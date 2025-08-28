import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderTrackingProvider } from './contexts/OrderTrackingContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Branches from './pages/Branches';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderTrackingProvider>
          {/* Global scroll restoration component */}
          <ScrollToTop 
            behavior="auto"
            delay={0}
            excludePaths={['/dashboard']} // Exclude dashboard from auto scroll restoration
          />
          
          <Routes>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </OrderTrackingProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;