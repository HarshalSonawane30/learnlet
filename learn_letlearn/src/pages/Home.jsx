import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Star, MapPin, Heart, MessageCircle, Share2, Send, Bookmark, MoreHorizontal, TrendingUp, Code, Database, Smartphone } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import apiClient, { getAPIUrl } from '../utils/apiClient';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Fetch suggestions and posts
    fetchSuggestions();
    fetchPosts();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await apiClient.get('/api/users/suggestions');

      if (response.data) {
        const data = response.data;
        
        // Transform backend data to match frontend format
        const transformedSuggestions = data.suggestions?.map(user => ({
          id: user._id,
          name: user.name,
          role: user.role,
          avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
          skills: [...(user.skillsTeach || []), ...(user.skillsLearn || [])].slice(0, 3),
          rating: 4.5 + Math.random() * 0.4, // Mock rating for now
          studentsCount: Math.floor(Math.random() * 300) + 50,
          location: user.location || 'Not specified',
          matchScore: Math.floor(75 + Math.random() * 25),
          bio: user.bio || 'Member of Learn & Let Learn'
        })) || [];

        setSuggestions(transformedSuggestions);
      } else {
        // Fallback to mock data if API fails
        const mockSuggestions = [
        {
          id: 1,
          name: 'Rahul Sharma',
          role: 'teacher',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
          skills: ['React', 'JavaScript', 'Node.js'],
          rating: 4.8,
          studentsCount: 156,
          location: 'Mumbai, India',
          matchScore: 95,
          bio: 'Senior Full Stack Developer | Teaching Web Development'
        },
        {
          id: 2,
          name: 'Priya Patel',
          role: 'both',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
          skills: ['Python', 'Machine Learning', 'Data Science'],
          rating: 4.9,
          studentsCount: 234,
          location: 'Bangalore, India',
          matchScore: 88,
          bio: 'AI Researcher & Educator | IIT Bombay'
        },
        {
          id: 3,
          name: 'Arjun Reddy',
          role: 'teacher',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
          skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
          rating: 4.7,
          studentsCount: 89,
          location: 'Hyderabad, India',
          matchScore: 82,
          bio: 'Product Designer | Ex-Flipkart, Ex-Amazon'
        },
        {
          id: 4,
          name: 'Sneha Desai',
          role: 'learner',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
          skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
          rating: 4.6,
          studentsCount: 45,
          location: 'Pune, India',
          matchScore: 78,
          bio: 'Marketing Professional seeking coding skills'
        },
        {
          id: 5,
          name: 'Vikram Singh',
          role: 'both',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
          skills: ['Java', 'Spring Boot', 'Microservices'],
          rating: 4.9,
          studentsCount: 312,
          location: 'Delhi, India',
          matchScore: 91,
          bio: 'Tech Lead @ TCS | Passionate Teacher'
        }
      ];
      setSuggestions(mockSuggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get('/api/posts/feed');

      if (response.data) {
        const data = response.data;
        const apiUrl = getAPIUrl();
        
        // Transform backend data to match frontend format
        const transformedPosts = data.posts?.map(post => ({
          id: post._id,
          author: {
            name: post.userId?.name || 'Unknown User',
            avatar: post.userId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId?.name || 'User'}`,
            role: post.userId?.role || 'learner',
            headline: post.userId?.bio || 'Member of Learn & Let Learn'
          },
          content: post.content,
          image: post.mediaUrl ? (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${apiUrl}${post.mediaUrl}`) : null,
          mediaUrl: post.mediaUrl,
          timestamp: getTimeAgo(post.createdAt),
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          shares: 0,
          isLiked: post.likes?.includes(user?._id || user?.id)
        })) || [];

        setPosts(transformedPosts);
      } else {
        console.error('Failed to fetch posts');
        setPosts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setLoading(false);
    }
  };

  // Helper function to format timestamps
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    return 'Just now';
  };

  const getRoleBadge = (role) => {
    const badges = {
      teacher: { icon: GraduationCap, class: 'badge-teacher', text: 'Teacher' },
      learner: { icon: BookOpen, class: 'badge-learner', text: 'Learner' },
      both: { icon: Users, class: 'badge-both', text: 'Teacher & Learner' }
    };
    const badge = badges[role] || badges.learner;
    const Icon = badge.icon;
    return (
      <span className={`badge ${badge.class} flex items-center gap-1`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-20 pt-16">
        {/* Instagram-style Feed Layout */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Posts Feed - Instagram Style */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {/* Post Header - Instagram Style */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full cursor-pointer border-2 border-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                      onClick={() => navigate(`/profile/${post.id}`)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-semibold text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/profile/${post.id}`)}
                        >
                          {post.author.name}
                        </h3>
                        {getRoleBadge(post.author.role)}
                      </div>
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-gray-900">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Image - Full Width Instagram Style */}
                {post.image && (
                  <div className="w-full">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full object-cover"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                )}
                
                {/* Instagram-style Action Buttons */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className={`transition-all hover:scale-110 ${post.isLiked ? 'text-red-500' : 'text-gray-900'}`}>
                        <Heart className={`w-7 h-7 ${post.isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button className="text-gray-900 hover:text-gray-600 transition-all hover:scale-110">
                        <MessageCircle className="w-7 h-7" />
                      </button>
                      <button className="text-gray-900 hover:text-gray-600 transition-all hover:scale-110">
                        <Send className="w-7 h-7" />
                      </button>
                    </div>
                    <button className="text-gray-900 hover:text-gray-600 transition-all hover:scale-110">
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Likes Count */}
                  <div className="mt-2">
                    <p className="font-semibold text-sm text-gray-900">{post.likes} likes</p>
                  </div>
                  
                  {/* Post Content - Instagram Style */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold mr-2">{post.author.name}</span>
                      {post.content}
                    </p>
                  </div>
                  
                  {/* View Comments Link */}
                  {post.comments > 0 && (
                    <button className="text-sm text-gray-500 hover:text-gray-700 mt-2">
                      View all {post.comments} comments
                    </button>
                  )}
                  
                  {/* Add Comment */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm outline-none"
                    />
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-700">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions Sidebar - Right Side */}
          <div className="hidden lg:block fixed right-8 top-24 w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Suggested for you</h3>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">See All</button>
              </div>
              
              <div className="space-y-3">
                {suggestions.slice(0, 5).map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={suggestion.avatar}
                        alt={suggestion.name}
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => navigate(`/profile/${suggestion.id}`)}
                      />
                      <div>
                        <h4
                          className="font-semibold text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/profile/${suggestion.id}`)}
                        >
                          {suggestion.name}
                        </h4>
                        <p className="text-xs text-gray-500">{suggestion.location}</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trending Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Trending Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 cursor-pointer transition-colors">
                  <Code className="inline w-3 h-3 mr-1" />React
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium hover:bg-green-100 cursor-pointer transition-colors">
                  <Database className="inline w-3 h-3 mr-1" />Python
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium hover:bg-purple-100 cursor-pointer transition-colors">
                  <Smartphone className="inline w-3 h-3 mr-1" />UI/UX
                </span>
                <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium hover:bg-orange-100 cursor-pointer transition-colors">
                  Data Science
                </span>
                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-100 cursor-pointer transition-colors">
                  DevOps
                </span>
                <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium hover:bg-pink-100 cursor-pointer transition-colors">
                  ML
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
