import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    HiArrowLeft, HiThumbUp, HiChat, HiHeart, HiClock, HiSearch
} from 'react-icons/hi';
import './UserPosts.css';

const MOCK_POSTS = [
    {
        id: 1,
        title: 'Best fertilizer for Maize in Black Soil?',
        body: 'I have been trying different fertilizers for maize this season. NPK 20-20-20 gave me great results in Kharif. Anyone else experience something similar with black soil in Vidarbha region?',
        tags: ['Maize', 'Fertilizer', 'Kharif'],
        likes: 24,
        comments: 8,
        time: '2h ago',
        category: 'Question',
        categoryColor: '#2196f3'
    },
    {
        id: 2,
        title: 'My Onion crop recovered from blight — here\'s what I used',
        body: 'Last month my Onion crop in Nashik got hit badly by blight. I used Mancozeb 75% WP mixed with copper fungicide. Applied twice in 10-day intervals. Full recovery in 3 weeks!',
        tags: ['Onion', 'Disease', 'Recovery'],
        likes: 61,
        comments: 19,
        time: '1d ago',
        category: 'Success Story',
        categoryColor: '#4caf50'
    },
    {
        id: 3,
        title: 'Looking for organic pesticide for Tomato whitefly',
        body: 'My tomato plants are getting affected by whitefly and I want to avoid chemical pesticides. Has anyone tried neem oil spray? What concentration works best?',
        tags: ['Tomato', 'Organic', 'Pest Control'],
        likes: 17,
        comments: 12,
        time: '3d ago',
        category: 'Question',
        categoryColor: '#2196f3'
    },
    {
        id: 4,
        title: 'Drip irrigation setup cost breakdown for 2 acres',
        body: 'Sharing my full cost breakdown for drip irrigation on 2 acres of sugarcane in Pune district. Total cost ₹42,000. Subsidy received: ₹18,500 from Maharashtra gov scheme. Net cost ₹23,500.',
        tags: ['Irrigation', 'Sugarcane', 'Finance'],
        likes: 89,
        comments: 34,
        time: '5d ago',
        category: 'Guide',
        categoryColor: '#ff9800'
    },
    {
        id: 5,
        title: 'Wheat MSP 2026 — is it worth selling at mandi?',
        body: 'MSP for wheat this year is ₹2275/quintal. My local mandi in Solapur is offering ₹2180. Should I hold stock and wait or sell now? What are others doing?',
        tags: ['Wheat', 'MSP', 'Market'],
        likes: 43,
        comments: 27,
        time: '1w ago',
        category: 'Discussion',
        categoryColor: '#9c27b0'
    },
    {
        id: 6,
        title: 'KrishiSense AI recommended Cotton — sharing results after 90 days',
        body: 'KrishiSense recommended Cotton for my soil profile (pH 7.2, Black soil). I followed it and now at 90 days the plants look excellent. Market is also favourable at ₹6800/quintal currently!',
        tags: ['Cotton', 'AI Prediction', 'Success'],
        likes: 112,
        comments: 41,
        time: '2w ago',
        category: 'Success Story',
        categoryColor: '#4caf50'
    }
];

const UserPosts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState('All');
    const [likedPosts, setLikedPosts] = useState({});
    const [highlightedId, setHighlightedId] = useState(null);
    const postRefs = useRef({});

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const postId = parseInt(params.get('post'));
        if (postId) {
            setHighlightedId(postId);
            // Wait for render then scroll
            setTimeout(() => {
                postRefs.current[postId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
            // Remove highlight after 3s
            setTimeout(() => setHighlightedId(null), 3000);
        }
    }, [location.search]);

    const allTags = ['All', 'Question', 'Success Story', 'Guide', 'Discussion'];

    const filtered = MOCK_POSTS.filter(post => {
        const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
            || post.body.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterTag === 'All' || post.category === filterTag;
        return matchSearch && matchFilter;
    });

    const handleLike = (id) => {
        setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="user-posts-container animate-fade-in">
            {/* Header */}
            <div className="posts-page-header glass-card">
                <button className="back-btn" onClick={() => navigate('/profile')}>
                    <HiArrowLeft />
                    Back to Profile
                </button>
                <div className="posts-author-meta">
                    <img
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        alt="Author"
                        className="posts-author-avatar"
                    />
                    <div>
                        <h1>Farmer Ayush's Posts</h1>
                        <p className="posts-count-label">{MOCK_POSTS.length} posts · {MOCK_POSTS.reduce((a, b) => a + b.likes, 0)} total likes</p>
                    </div>
                </div>
            </div>

            {/* Search + Filter Bar */}
            <div className="posts-controls glass-card">
                <div className="search-input-wrap">
                    <HiSearch className="search-icon-small" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="posts-search-input"
                    />
                </div>
                <div className="filter-pills">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className={`filter-pill ${filterTag === tag ? 'active' : ''}`}
                            onClick={() => setFilterTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
            <div className="posts-feed">
                {filtered.length === 0 ? (
                    <div className="no-results glass-card">
                        <p>No posts found for "{searchQuery}"</p>
                    </div>
                ) : (
                    filtered.map((post, idx) => (
                        <div
                            key={post.id}
                            ref={el => postRefs.current[post.id] = el}
                            className={`post-card glass-card animate-slide-up ${highlightedId === post.id ? 'post-highlighted' : ''}`}
                            style={{ animationDelay: `${idx * 0.07}s` }}
                        >
                            <div className="post-card-header">
                                <span
                                    className="post-category-badge"
                                    style={{ backgroundColor: `${post.categoryColor}15`, color: post.categoryColor }}
                                >
                                    {post.category}
                                </span>
                                <span className="post-time"><HiClock /> {post.time}</span>
                            </div>

                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-body">{post.body}</p>

                            <div className="post-tags">
                                {post.tags.map(tag => (
                                    <span key={tag} className="post-tag">#{tag}</span>
                                ))}
                            </div>

                            <div className="post-actions">
                                <button
                                    className={`post-action-btn like-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    <HiHeart />
                                    <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                                </button>
                                <button className="post-action-btn comment-btn">
                                    <HiChat />
                                    <span>{post.comments} Comments</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserPosts;
