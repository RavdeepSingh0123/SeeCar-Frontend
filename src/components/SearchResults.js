import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Navbar from './Navbar';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword');

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return;
      
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`https://seecar-backend.onrender.com/api/car/search?keyword=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: {
                'auth-token': token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.response?.data?.message || "No products found with the given keyword");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  // Image source helper function
  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (Array.isArray(image.data)) {
      const base64String = Buffer.from(image.data).toString('base64');
      return `data:${image.contentType};base64,${base64String}`;
    }
    return null;
  };

  // Image modal handlers
  const openCarDetails = (car) => {
    setSelectedCar(car);
    setCurrentImageIndex(0);
    setShowImageModal(true);
  };

  const closeCarDetails = () => {
    setSelectedCar(null);
    setShowImageModal(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedCar && currentImageIndex < selectedCar.images.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedCar && currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <Navbar>
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Search Results for "{keyword}"
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back
            </button>
          </div>

          {loading && (
            <div className="text-center">
              <p className="text-gray-500">Loading cars...</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">No cars found</h2>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((car) => (
                <div key={car._id} className="bg-white shadow rounded-lg p-4">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={getImageSrc(car.images[0])}
                      alt={`${car.title}`}
                      className="h-40 w-full object-cover rounded-md mb-2 cursor-pointer"
                      onClick={() => openCarDetails(car)}
                    />
                  ) : (
                    <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">No Image</p>
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{car.title}</h3>
                  <p className="text-gray-600">{car.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {car.tags && car.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Image Slider Modal */}
          {showImageModal && selectedCar && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative">
                <button
                  onClick={closeCarDetails}
                  className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Image Slider */}
                <div className="relative h-96 mb-4">
                  <img
                    src={getImageSrc(selectedCar.images[currentImageIndex])}
                    alt={`${selectedCar.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  
                  {/* Navigation Arrows */}
                  {currentImageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-opacity"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}
                  
                  {selectedCar.images && currentImageIndex < selectedCar.images.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-opacity"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {selectedCar.images.length}
                  </div>
                </div>

                {/* Car Details */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCar.title}</h2>
                  <p className="text-gray-600">{selectedCar.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCar.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {selectedCar.images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {selectedCar.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={getImageSrc(image)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default SearchResults;