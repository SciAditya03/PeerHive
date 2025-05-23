'use client';

import React, { useState, useRef } from 'react';
import { 
  Image, 
  X, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Camera,
  Hash,
  Users,
  Globe,
  Lock
} from 'lucide-react';

export default function CreatePost() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [charCount, setCharCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const maxChars = 500;
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxChars) {
      setText(newText);
      setCharCount(newText.length);
      if (error) setError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setImage(file);
    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const simulateApiCall = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, message: 'Post created successfully!' });
        } else {
          reject({ message: 'Failed to create post. Please try again.' });
        }
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!text.trim() && !image) {
      setError('Please add some text or an image to your post');
      return;
    }

    if (text.trim().length < 3) {
      setError('Post text must be at least 3 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      const response = await simulateApiCall();
      
      setSuccess(response.message);
      
      // Reset form
      setTimeout(() => {
        setText('');
        setImage(null);
        setPreview(null);
        setTags([]);
        setTagInput('');
        setCharCount(0);
        setVisibility('public');
        setSuccess('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCharCountColor = () => {
    const percentage = (charCount / maxChars) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this post' },
    { value: 'friends', label: 'Friends', icon: Users, description: 'Only your connections can see this' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you can see this post' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts with the Peerhive community</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <div className="relative">
                <textarea
                  placeholder="What's on your mind? Share your thoughts, experiences, or questions..."
                  value={text}
                  onChange={handleTextChange}
                  className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
                  disabled={isLoading}
                />
                <div className={`absolute bottom-3 right-3 text-sm ${getCharCountColor()}`}>
                  {charCount}/{maxChars}
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Camera className="w-5 h-5" />
                  Add Image
                </button>
                <span className="text-sm text-gray-500">Max 5MB • JPG, PNG, GIF</span>
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="relative">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading || tags.length >= 5}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    disabled={isLoading || !tagInput.trim() || tags.length >= 5}
                  >
                    Add
                  </button>
                </div>
                
                {/* Tag Display */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-blue-600"
                          disabled={isLoading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  {tags.length}/5 tags • Press Enter or Space to add a tag
                </p>
              </div>
            </div>

            {/* Visibility Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who can see this post?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {visibilityOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`relative flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                        visibility === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={visibility === option.value}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        visibility === option.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          visibility === option.value ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-xs ${
                          visibility === option.value ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isLoading || (!text.trim() && !image)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Post...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Create Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for better posts</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use relevant tags to help others discover your content</li>
            <li>• Add images to make your posts more engaging</li>
            <li>• Keep your content respectful and relevant to the community</li>
            <li>• Consider your audience when choosing visibility settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
