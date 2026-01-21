import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Video, Type, Upload, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import apiClient from '../utils/apiClient';

const CreatePost = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState('text'); // 'text', 'image', 'video'
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) {
      alert('Please add some content or media');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('content', content);
      if (media) {
        formData.append('media', media);
      }

      const response = await apiClient.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (response.status === 201 || response.status === 200) {
        alert('Post created successfully!');
        // Reset form
        setContent('');
        setMedia(null);
        setPreview(null);
        setPostType('text');
        // Navigate to home and the feed will auto-refresh
        navigate('/home');
      } else {
        alert(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const postTypes = [
    { value: 'text', icon: Type, label: 'Text', accept: null },
    { value: 'image', icon: ImageIcon, label: 'Image', accept: 'image/*' },
    { value: 'video', icon: Video, label: 'Video', accept: 'video/*' }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-20 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
            <button
            onClick={handleSubmit}
            disabled={loading || (!content.trim() && !media)}
            className="btn-primary text-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Select Post Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {postTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    setPostType(type.value);
                    if (type.value === 'text') {
                      handleRemoveMedia();
                    }
                  }}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    postType === type.value
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${postType === type.value ? 'text-primary' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${postType === type.value ? 'text-primary' : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Input */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your thoughts, progress, or questions..."
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Media Upload */}
        {(postType === 'image' || postType === 'video') && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {postType === 'image' ? 'Upload Image' : 'Upload Video'}
            </h3>
            
            {!preview ? (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={postTypes.find(t => t.value === postType)?.accept}
                  onChange={handleMediaSelect}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">
                  Click to upload {postType}
                </p>
                <p className="text-sm text-gray-500">
                  {postType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 100MB'}
                </p>
              </label>
            ) : (
              <div className="relative">
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                {postType === 'image' ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Great Posts</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Share your learning journey and progress</li>
            <li>• Ask questions to engage with the community</li>
            <li>• Use clear images or videos to illustrate your points</li>
            <li>• Be respectful and supportive of others</li>
          </ul>
        </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
