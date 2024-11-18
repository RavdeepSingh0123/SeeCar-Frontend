import React, { useState, useRef,useEffect } from 'react';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Addcar = () => {
  const [carData, setCarData] = useState({
    title: '',
    desc: '',
    tags: '',
    images: [] // Will store base64 strings
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token is found
      navigate('/login');
    }
  }, [navigate]);
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (carData.images.length === 0) {
      alert('Please select at least one image');
      return;
    }

    if (carData.images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch('https://seecar-backend.onrender.com/api/car/addcar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem("token"),
        },
        body: JSON.stringify(carData)
      });

      const responseData = await response.json();
      console.log("Backend response:", responseData);

      if (response.ok) {
        setCarData({ title: '', desc: '', tags: '', images: [] });
        setPreviewUrls([]);
        alert('Car added successfully!');
      } else {
        throw new Error(responseData.error || 'Failed to add car');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to add car. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + carData.images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    try {
      // Convert all selected files to base64 in parallel
      const base64Promises = files.map(file => convertToBase64(file));
      const base64Results = await Promise.all(base64Promises);

      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));

      // Update state
      setCarData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Results]
      }));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    } catch (error) {
      console.error('Error converting images:', error);
      alert('Error processing images. Please try again.');
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setCarData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate('/')}
        className="text-indigo-600 mb-6 flex items-center space-x-2 hover:text-indigo-800"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      <h2 className="text-2xl font-bold mb-4">Add New Car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-bold text-gray-700">Title</label>
          <input
            type="text"
            value={carData.title}
            onChange={(e) => setCarData({ ...carData, title: e.target.value })}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-bold text-gray-700">Tags</label>
          <input
            type="text"
            value={carData.tags}
            onChange={(e) => setCarData({ ...carData, tags: e.target.value })}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="luxury, sports, sedan"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea
            value={carData.desc}
            onChange={(e) => setCarData({ ...carData, desc: e.target.value })}
            rows={4}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-bold text-gray-700">Images (Max 10)</label>
          <div
            className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer rounded-md"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload images(Max Image Size:10Kb)</p>
            <p className="mt-1 text-xs text-gray-500">
              {carData.images.length}/10 images selected

            </p>
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            uploading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Add Car'}
        </button>
      </form>
    </div>
  );
};

export default Addcar;