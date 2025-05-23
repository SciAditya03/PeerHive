'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const roles = ['student', 'club', 'faculty', 'admin'];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const getPasswordStrength = (password) => {
    const validation = validatePassword(password);
    const score = Object.values(validation).filter(Boolean).length;
    
    if (score <= 2) return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score <= 4) return { strength: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const validateForm = () => {
    const newErrors = {};

    if (isRegister && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isRegister) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.length) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
    }

    if (isRegister && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const simulateApiCall = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.3) {
          resolve({ success: true, message: isRegister ? 'Account created successfully!' : 'Welcome back!' });
        } else {
          reject({ message: isRegister ? 'Email already exists' : 'Invalid credentials' });
        }
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await simulateApiCall();
      setSuccessMessage(response.message);
      console.log(isRegister ? 'Registering' : 'Logging in', formData);
      
      // Reset form on successful registration
      if (isRegister) {
        setTimeout(() => {
          setIsRegister(false);
          setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
          setSuccessMessage('');
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
    setErrors({});
    setSuccessMessage('');
  };

  const passwordStrength = isRegister && formData.password ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegister ? 'Join' : 'Welcome to'} Peerhive
          </h2>
          <p className="text-gray-600 text-sm">
            {isRegister ? 'Create your account to get started' : 'Sign in to your account'}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 text-sm">{successMessage}</span>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm">{errors.submit}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Name Field */}
          {isRegister && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {isRegister && formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Password strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength === 'Weak' ? 'text-red-600' :
                    passwordStrength.strength === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          {isRegister && (
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Role Selection */}
          {isRegister && (
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                aria-label="Select your role"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            onClick={toggleMode}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium mt-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRegister ? 'Sign in instead' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  );
}
