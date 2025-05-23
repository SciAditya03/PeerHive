'use client';

import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  Share2, 
  Filter,
  Search,
  TrendingUp,
  ChevronUp,
  Hash,

  Calendar
} from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock post data with more variety
  const mockPosts = [
    {
      id: 1,
      title: 'How to prepare for the upcoming intern fair?',
      author: 'Ayash Kumar',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ayash',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
      text: 'Hey everyone! The intern fair is coming up next month and I wanted to share some strategies that worked for me last year. First, research the companies beforehand and prepare specific questions. Second, bring multiple copies of your resume and dress professionally. What other tips do you have?',
      tags: ['internship', 'career', 'advice'],
      likes: 24,
      comments: 8,
      createdAt: '2024-05-23T14:15:00Z',
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      title: 'Club Registrations are now open!',
      author: 'PeerClubs Official',
      role: 'club',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PC',
      image: null,
      text: 'Exciting news! Registration for all student clubs is now open until May 31st. Join us to connect with like-minded peers, develop new skills, and make lasting friendships. We have clubs for every interest - from tech and arts to sports and volunteering!',
      tags: ['clubs', 'registration', 'community'],
      likes: 56,
      comments: 12,
      createdAt: '2024-05-22T18:40:00Z',
      timeAgo: '1 day ago'
    },
    {
      id: 3,
      title: 'New Research Opportunities in AI/ML',
      author: 'Dr. Sarah Johnson',
      role: 'faculty',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      text: 'Our department is offering several undergraduate research positions in artificial intelligence and machine learning. This is a great opportunity to gain hands-on experience with cutting-edge technology. Applications are due by June 15th.',
      tags: ['research', 'AI', 'ML', 'opportunity'],
      likes: 89,
      comments: 23,
      createdAt: '2024-05-21T10:30:00Z',
      timeAgo: '2 days ago'
    },
    {
      id: 4,
      title: 'System Maintenance - May 25th',
      author: 'IT Support',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=IT',
      image: null,
      text: 'Please be aware that the university network will undergo scheduled maintenance on May 25th from 2:00 AM to 6:00 AM. During this time, online services may be temporarily unavailable. We apologize for any inconvenience.',
      tags: ['maintenance', 'announcement', 'IT'],
      likes: 12,
      comments: 3,
      createdAt: '2024-05-20T16:20:00Z',
      timeAgo: '3 days ago'
    },
    {
      id: 5,
      title: 'Looking for study group partners for Data Structures',
      author: 'Mike Chen',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      image: null,
      text: 'Hey CS majors! I\'m looking for 2-3 people to form a study group for Data Structures (CS 201). We can meet twice a week to go through problem sets and prepare for exams. DM me if interested!',
      tags: ['study-group', 'CS', 'data-structures'],
      likes: 18,
      comments: 15,
      createdAt: '2024-05-19T09:45:00Z',
      timeAgo: '4 days ago'
    }
  ];

  const roles = ['all', 'student', 'club', 'faculty', 'admin'];

  const getRoleBadge = (role) => {
    const styles = {
      student: 'bg-blue-100 text-blue-800 border-blue-200',
      club: 'bg-purple-100 text-purple-800 border-purple-200',
      faculty: 'bg-green-100 text-green-800 border-green-200',
      admin: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      student: '🎓',
      club: '🏛️',
      faculty: '👨‍🏫',
      admin: '⚙️'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[role]}`}>
        <span>{icons[role]}</span>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const simulateApiCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPosts);
      }, 1000);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await simulateApiCall();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(post => post.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort posts
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    }

    setFilteredPosts(filtered);
  }, [posts, selectedRole, sortBy, searchQuery]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">PeerHive Feed</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              {filteredPosts.length} posts
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-4 pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={`${post.author}'s avatar`}
                        className="w-10 h-10 rounded-full border-2 border-gray-100"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{post.author}</span>
                          {getRoleBadge(post.role)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {post.timeAgo}
                        </div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Post Title */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                    {post.title}
                  </h2>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="px-4 mb-3">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => window.open(post.image, '_blank')}
                      />
                      <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="px-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">{post.text}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          <Hash className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
                    >
                      <Heart className="w-5 h-5 group-hover:fill-current" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm">Vote</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
