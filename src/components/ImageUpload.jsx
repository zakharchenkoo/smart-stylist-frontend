import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageUpload, currentImageUrl }) => {
  const [preview, setPreview] = useState(currentImageUrl || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.url); 
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Using local preview.');
      onImageUpload(preview); 
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={() => {
              setPreview('');
              onImageUpload('');
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {/* URL Input */}
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) {
              setPreview(url);
              onImageUpload(url);
            }
          }}
          className="btn-secondary text-sm py-3"
        >
          🔗 URL
        </button>

        {/* Choose File */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary text-sm py-3"
          disabled={uploading}
        >
          📁 {uploading ? 'Uploading...' : 'Choose File'}
        </button>

        {/* Take Photo */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="btn-secondary text-sm py-3"
          disabled={uploading}
        >
          📷 Camera
        </button>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;