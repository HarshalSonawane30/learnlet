import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, Users } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // 'teacher', 'learner', 'both'
    skills: [],
    interests: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/register', formData);

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'teacher',
      icon: GraduationCap,
      title: 'Teacher',
      description: 'I want to teach skills to others'
    },
    {
      value: 'learner',
      icon: BookOpen,
      title: 'Learner',
      description: 'I want to learn new skills'
    },
    {
      value: 'both',
      icon: Users,
      title: 'Both',
      description: 'I want to teach and learn'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-custom"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-custom" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-custom" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative glass backdrop-blur-2xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 lg:p-10 animate-fadeIn border border-white/30 my-4">
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 hover:-rotate-12 transition-transform duration-300">
              <span className="text-3xl sm:text-4xl font-bold text-white">L</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text mb-2 tracking-tight">LetLearn</h1>
          <p className="text-gray-700 text-base sm:text-lg font-semibold">Join the community! 🎓</p>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Create your account to start learning</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className={`flex items-center transition-all duration-300 ${step === 1 ? 'text-blue-600' : 'text-teal-600'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-lg ${step === 1 ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' : 'bg-teal-600 text-white'}`}>
              {step === 1 ? '1' : '✓'}
            </div>
            <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-bold">Account Info</span>
          </div>
          <div className={`w-12 sm:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${step === 2 ? 'bg-gradient-to-r from-blue-600 to-teal-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center transition-all duration-300 ${step === 2 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-lg ${step === 2 ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-bold">Your Role</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-sm font-medium shadow-sm animate-slideUp">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-14 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2"
            >
              Next Step →
            </button>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3 sm:mb-4">
                Choose Your Role 🎯
              </h3>
              <p className="text-gray-600 text-center mb-4 sm:mb-6 text-xs sm:text-sm">
                Select how you want to use LetLearn
              </p>
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.role === option.value;
                const colors = {
                  teacher: 'from-blue-600 to-blue-700',
                  learner: 'from-green-600 to-emerald-600',
                  both: 'from-teal-600 to-cyan-600'
                };
                return (
                  <div
                    key={option.value}
                    onClick={() => handleRoleSelect(option.value)}
                    className={`group p-4 sm:p-5 border-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      isSelected
                        ? `border-transparent bg-gradient-to-r ${colors[option.value]} shadow-xl`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
                        isSelected ? 'bg-white/20 text-white scale-110' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-base sm:text-lg mb-1 ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>{option.title}</h4>
                        <p className={`text-sm ${
                          isSelected ? 'text-white/90' : 'text-gray-600'
                        }`}>{option.description}</p>
                      </div>
                      <div className={`w-7 h-7 rounded-full border-3 flex items-center justify-center transition-all ${
                        isSelected ? 'border-white bg-white' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[option.value]}`}></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  <span>Create Account 🎉</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm font-medium text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 font-bold hover:underline">
              Sign In Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
