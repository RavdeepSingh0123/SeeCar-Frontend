import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="ml-2 text-lg font-medium">Back</span>
      </button>

      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <p className="text-xl text-gray-600">
          Welcome to <span className="font-semibold text-indigo-600">SeeCar</span>! Your trusted platform for car management.
        </p>
      </div>

      {/* Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At <span className="font-semibold text-indigo-600">SeeCar</span>, we aim to simplify the process of managing and exploring cars for
          users. From creating detailed car listings with images and tags to searching and managing cars efficiently, we
          provide all the tools you need in one place.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Comprehensive Listings',
            description: 'Create detailed car listings with up to 10 images, titles, descriptions, and customizable tags.',
          },
          {
            title: 'Easy Management',
            description: 'Update, delete, and search for your cars effortlessly, ensuring complete control over your inventory.',
          },
          {
            title: 'User-Friendly Interface',
            description: 'A sleek, responsive design for seamless navigation on any device.',
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Closing Section */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Ready to experience the future of car management? <br />
          <span className="font-semibold text-indigo-600">Join SeeCar today!</span>
        </p>
      </div>
    </div>
  );
};

export default About;
