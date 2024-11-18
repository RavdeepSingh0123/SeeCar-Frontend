import React, { useEffect, useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carForm, setCarForm] = useState({ title: '', desc: '', tags: [], image: null });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();
    // Check if the user is authenticated
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if no token is found
        navigate('/login');
      }
    }, [navigate]);
  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User is not authenticated');

      const response = await fetch('https://seecar-backend.onrender.com/api/car/listcars', {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch cars');

      const data = await response.json();
      setCars(data);
    } catch (err) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (Array.isArray(image.data)) {
      const base64String = Buffer.from(image.data).toString('base64');
      return `data:${image.contentType};base64,${base64String}`;
    }
    return null;
  };

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

  // ... [Keep all existing handler functions unchanged] ...
  const handleUpdateCar = (car) => {
    setCarForm({
      title: car.title,
      desc: car.desc,
      tags: car.tags,
      image: car.images && car.images[0] ? car.images[0] : null,
    });
    setIsEditing(true);
    setSelectedCar(car);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCarForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCarForm((prevForm) => ({
        ...prevForm,
        images: files,
    }));
}

const handleSaveChanges = async () => {
  const formData = new FormData();
  formData.append('title', carForm.title);
  formData.append('desc', carForm.desc);
  formData.append('tags', carForm.tags.join(','));

  if (carForm.images && carForm.images.length > 0) {
    carForm.images.forEach((image, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        formData.append('images', reader.result);
      };
    });
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('User is not authenticated');

    // Wait for base64 conversion
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const response = await fetch(`https://seecar-backend.onrender.com/api/car/updatecar/${selectedCar._id}`, {
      method: 'PUT',
      headers: {
        'auth-token': token,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update car');
    }

    // Close the modal, navigate to home, and refresh the car list
    setIsEditing(false);
    setSelectedCar(null);
    fetchCars(); // Reload the list
    navigate('/'); // Navigate back to home
  } catch (err) {
    setError(err.message || 'Unexpected error occurred');
  }
};

  

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedCar(null);
  };

  const handleDeleteCar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User is not authenticated');

      const response = await fetch(`https://seecar-backend.onrender.com/api/car/deletecar/${carToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': token,
        },
      });

      if (!response.ok) throw new Error('Failed to delete car');

      setCars(cars.filter((car) => car._id !== carToDelete._id));
      setIsDeleting(false);
      setCarToDelete(null);
    } catch (err) {
      setError(err.message || 'Unexpected error occurred');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setCarToDelete(null);
  };

  return (
    <Navbar>
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to SeeCar</h1>
            <button
              onClick={() => navigate('/addcar')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Listing
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center">
              <p className="text-gray-500">Loading cars...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && cars.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">No cars available</h2>
              <p className="text-gray-600">Here's a sample car detail:</p>
              <div className="mt-4 bg-white shadow rounded-lg p-4 max-w-lg mx-auto">
                <h3 className="text-lg font-bold">Sample Car Title</h3>
                <p>Description: This is a sample description for a car.</p>
                <p>Tags: <span className="text-blue-600">Sample, Tags</span></p>
              </div>
            </div>
          )}

          {/* Cars Grid */}
          {!isLoading && !error && cars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
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

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleUpdateCar(car)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setCarToDelete(car);
                        setIsDeleting(true);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
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

          {/* Floating Form for Editing */}
          {isEditing && selectedCar && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
                <button
                  onClick={handleCancelEdit}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Close
                </button>
                <div>
                  <h3 className="text-xl font-bold">Update Car</h3>
                  <form>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={carForm.title}
                        onChange={handleFormChange}
                        className="mt-2 p-2 w-full border rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Description</label>
                      <input
                        type="text"
                        name="desc"
                        value={carForm.desc}
                        onChange={handleFormChange}
                        className="mt-2 p-2 w-full border rounded-md"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        value={carForm.tags.join(',')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map((tag) => tag.trim());
                          setCarForm((prevForm) => ({
                            ...prevForm,
                            tags,
                          }));
                        }}
                        className="mt-2 p-2 w-full border rounded-md"
                      />
                    </div>
                    {/* <div className="mt-4">
                      <label className="text-sm font-medium">Image</label>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-2"
                      />
                    </div> */}
                  </form>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Dialog for Deletion */}
          {isDeleting && carToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center">
                <h3 className="text-lg font-semibold">Are you sure?</h3>
                <p className="mt-2 text-gray-600">You are about to delete this car listing.</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleDeleteCar}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Home;
