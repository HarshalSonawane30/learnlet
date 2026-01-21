import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Trash2, X, Check, MapPin, Link, Calendar, Mail, Phone, Briefcase, Save } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import apiClient, { getAPIUrl } from '../utils/apiClient';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    occupation: '',
    joinDate: '',
    followers: 0,
    following: 0,
    posts: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setProfileData({
        name: user.name || 'User',
        username: '@' + (user.email?.split('@')[0] || 'user'),
        bio: user.bio || 'No bio yet',
        location: user.location || 'Not specified',
        website: user.website || '',
        email: user.email || '',
        phone: user.phone || '',
        occupation: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
        posts: user.posts?.length || 0
      });
      if (user.avatar) {
        setProfileImage(user.avatar);
      }
    }
  }, []);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempBio, setTempBio] = useState(profileData.bio);
  const [tempProfile, setTempProfile] = useState({ ...profileData });
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop');
  const [posts, setPosts] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch user's posts
  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await apiClient.get('/api/posts/feed');

      if (response.data) {
        const data = response.data;
        // Filter to only show current user's posts
        const userPosts = data.posts?.filter(post => post.userId?._id === user._id || post.userId?.id === user._id) || [];
        
        // Transform to match profile display format
        const apiUrl = getAPIUrl();
        const transformedPosts = userPosts.map(post => ({
          id: post._id,
          image: post.mediaUrl ? `${apiUrl}${post.mediaUrl}` : null,
          content: post.content,
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          createdAt: post.createdAt
        }));
        
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleImageUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImage(reader.result);
        } else if (type === 'cover') {
          setCoverImage(reader.result);
        } else if (type === 'post') {
          const newPost = {
            id: Date.now(),
            image: reader.result,
            likes: 0,
            comments: 0
          };
          setPosts([newPost, ...posts]);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(null);
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const saveBio = () => {
    setProfileData({ ...profileData, bio: tempBio });
    setIsEditingBio(false);
  };

  const saveProfile = () => {
    setProfileData({ ...tempProfile });
    setIsEditingProfile(false);
  };

  const cancelEdit = () => {
    setTempBio(profileData.bio);
    setIsEditingBio(false);
    setTempProfile({ ...profileData });
    setIsEditingProfile(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16 pb-20">
        {/* Cover Image */}
        <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-blue-500 to-teal-600 overflow-hidden group">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => document.getElementById('cover-upload').click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
            >
              <Camera size={20} />
              Change Cover
            </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="cover-upload"
            onChange={(e) => handleImageUpload('cover', e)}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Profile Picture */}
            <div className="relative group">
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <button
                onClick={() => document.getElementById('profile-upload').click()}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Camera size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-upload"
                onChange={(e) => handleImageUpload('profile', e)}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left sm:ml-6 mt-4 sm:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                    <p className="text-gray-600 text-lg">{profileData.username}</p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="flex justify-center sm:justify-start gap-8 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profileData.posts}</div>
                    <div className="text-gray-600 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profileData.followers.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{profileData.following}</div>
                    <div className="text-gray-600 text-sm">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">About</h2>
            {!isEditingBio && (
              <button
                onClick={() => {
                  setTempBio(profileData.bio);
                  setIsEditingBio(true);
                }}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>
          {isEditingBio ? (
            <div>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your bio..."
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveBio}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Check size={18} />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{profileData.bio}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={20} className="text-gray-400" />
              <span>{profileData.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Link size={20} className="text-gray-400" />
              <a href={`https://${profileData.website}`} className="text-blue-600 hover:underline">
                {profileData.website}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-gray-400" />
              <span>{profileData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={20} className="text-gray-400" />
              <span>{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Briefcase size={20} className="text-gray-400" />
              <span>{profileData.occupation}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-gray-400" />
              <span>Joined {profileData.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'posts'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'about'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {activeTab === 'posts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
              <button
                onClick={() => document.getElementById('post-upload').click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Camera size={20} />
                Add Post
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="post-upload"
                onChange={(e) => handleImageUpload('post', e)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8">
              {posts.map((post) => (
                <div key={post.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-6">
                    <div className="opacity-0 group-hover:opacity-100 text-white flex items-center gap-2">
                      <span className="text-lg">❤️ {post.likes}</span>
                      <span className="text-lg">💬 {post.comments}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Me</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{profileData.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">📧 {profileData.email}</p>
                  <p className="text-gray-700">📱 {profileData.phone}</p>
                  <p className="text-gray-700">🌐 {profileData.website}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location & Work</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">📍 {profileData.location}</p>
                  <p className="text-gray-700">💼 {profileData.occupation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={tempProfile.username}
                    onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={tempProfile.location}
                    onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    value={tempProfile.website}
                    onChange={(e) => setTempProfile({ ...tempProfile, website: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={tempProfile.occupation}
                    onChange={(e) => setTempProfile({ ...tempProfile, occupation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveProfile}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Save size={20} />
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}