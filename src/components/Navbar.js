import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Navbar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-blue-600">
              SeeCar
            </Link>
            
            {/* Navbar Links */}
            <div className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className={`${
                  isActive('/') 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </Link>
              
              <Link 
                to="/about" 
                className={`${
                  isActive('/about') 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                About Us
              </Link>
            </div>
            
            {/* Search Bar and Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search..."
                  className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    const keyword = document.getElementById('searchInput').value;
                    if (keyword) {
                      navigate(`/search?keyword=${keyword}`);
                    }
                  }}
                >
                  Search
                </button>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto p-4 text-center text-gray-600">
          © 2024 SeeCar. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Navbar;
