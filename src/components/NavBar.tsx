// components/Navbar.tsx
import React, { useState } from 'react';
import { Briefcase, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartHire
            </span>
          </div>
          

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/sign-in" className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
           <Link to="/sign-up" className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="block text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="block text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="block text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <hr className="border-gray-200" />
           <Link to="/sign-in" className="flex items-center space-x-2 w-full px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
           <Link to="/sign-up" className="flex items-center justify-center space-x-2 w-full px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;