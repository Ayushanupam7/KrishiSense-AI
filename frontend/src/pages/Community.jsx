import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
    HiPencil, HiHeart, HiShare, HiAnnotation, HiFilter,
    HiPhotograph, HiX, HiPaperAirplane
} from 'react-icons/hi';
import './Community.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ─── Mock posts for instant display ────────────────────────────────────────
const MOCK_POSTS = [
    {
        id: 101, user_name: 'Ramesh Patil', user_image: 'https://i.pravatar.cc/150?u=ramesh',
        crop_tag: 'Cotton', timestamp: new Date(Date.now() - 7200000).toISOString(),
        content: 'My cotton yield doubled this year after switching to drip irrigation. NPK ratio 2:1:1 worked best for black soil in Vidarbha. Anyone else tried this combination?',
        likes: 47, comments: [
            { user: 'Suresh Kale', avatar: 'https://i.pravatar.cc/150?u=suresh', text: 'Same experience here! The key is watering frequency — once every 3 days in peak summer.', time: '1h ago' },
            { user: 'Anita More', avatar: 'https://i.pravatar.cc/150?u=anita', text: 'Which fertilizer brand did you use? I\'m planning the same.', time: '45m ago' },
        ]
    },
    {
        id: 102, user_name: 'Priya Sharma', user_image: 'https://i.pravatar.cc/150?u=priya',
        crop_tag: 'Tomato', timestamp: new Date(Date.now() - 18000000).toISOString(),
        content: 'Alert for tomato farmers in Pune: early blight spotted in my field. Symptoms — small brown spots with yellow rings on older leaves. Applied Mancozeb 75% and it\'s responding well. Watch out!',
        likes: 89, comments: [
            { user: 'Vijay Deshmukh', avatar: 'https://i.pravatar.cc/150?u=vijay', text: 'Thanks for the heads up! What concentration did you use?', time: '3h ago' },
        ]
    },
    {
        id: 103, user_name: 'Farmer Ayush', user_image: 'https://i.pravatar.cc/150?u=ayush',
        crop_tag: 'Wheat', timestamp: new Date(Date.now() - 86400000).toISOString(),
        content: 'MSP for Wheat 2026 is ₹2275/quintal. My local mandi is offering only ₹2180. Holding stock for now — anyone else seeing better rates? Which mandi is offering MSP or above?',
        likes: 62, comments: []
    },
    {
        id: 104, user_name: 'Kiran Jadhav', user_image: 'https://i.pravatar.cc/150?u=kiran',
        crop_tag: 'Maize', timestamp: new Date(Date.now() - 172800000).toISOString(),
        content: 'KrishiSense AI recommended Maize for my alluvial soil plot in Nashik. Followed the advice and got 38 quintals/acre this season. That\'s a 40% improvement from last year. AI really works! 🌟',
        likes: 134, comments: [
            { user: 'Meena Kulkarni', avatar: 'https://i.pravatar.cc/150?u=meena', text: 'That\'s incredible! What were your soil pH levels?', time: '2d ago' },
            { user: 'Raju Tiwari', avatar: 'https://i.pravatar.cc/150?u=raju', text: 'I got similar results with Cotton recommendation. This app is a game changer.', time: '1d ago' },
        ]
    },
];

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const CROP_COLORS = {
    Cotton: '#8b4513', Tomato: '#e53935', Wheat: '#f9a825',
    Maize: '#fb8c00', Rice: '#43a047', Sugarcane: '#00897b',
    General: '#5e35b1', Onion: '#7b1fa2', Default: '#2e7d32'
};
const Community = () => {
    const location = useLocation();
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [loading, setLoading] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState('All');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCrop, setNewPostCrop] = useState('General');
    const [newPostImage, setNewPostImage] = useState('');
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [submittingComment, setSubmittingComment] = useState(null);
    const [highlightedId, setHighlightedId] = useState(null);
    const postRefs = useRef({});
    const commentInputRef = useRef({});

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const postId = parseInt(params.get('post'));
        if (postId) {
            setHighlightedId(postId);
            // Wait for render/data then scroll
            setTimeout(() => {
                postRefs.current[postId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
            // Remove highlight after 3s
            setTimeout(() => setHighlightedId(null), 3000);
        }
    }, [location.search, posts]);

    const crops = ['All', 'Rice', 'Wheat', 'Tomato', 'Maize', 'Sugarcane', 'Cotton', 'Onion', 'General'];

    // Try fetching real data, fall back to mock
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/api/community/posts`, {
                    params: { crop: selectedCrop }, timeout: 3000
                });
                if (res.data?.results?.length > 0) setPosts(res.data.results);
            } catch {
                // keep mock data
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCrop]);

    const filtered = selectedCrop === 'All'
        ? posts
        : posts.filter(p => p.crop_tag === selectedCrop);

    const saveActivity = (type, detail, postId, color, icon) => {
        try {
            const existing = JSON.parse(localStorage.getItem('community_activity') || '[]');
            const newActivity = {
                id: Date.now(), postId, type, detail,
                date: 'Just now', icon, color, 
                timestamp: new Date().toISOString()
            };
            const updated = [newActivity, ...existing].slice(0, 15);
            localStorage.setItem('community_activity', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
        } catch (e) { console.error('Activity Save Error:', e); }
    };

    // ── Create Post ────────────────────────────────────────────────────────
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        const postId = Date.now();
        const newPost = {
            id: postId, user_name: 'Farmer Ayush',
            user_image: 'https://i.pravatar.cc/150?u=ayush',
            crop_tag: newPostCrop, timestamp: new Date().toISOString(),
            content: newPostContent, likes: 0, comments: [],
            image_url: newPostImage || null,
        };
        setPosts(prev => [newPost, ...prev]);
        saveActivity('post', `Posted "${newPostContent.substring(0, 30)}..."`, postId, '#4caf50', '📝');
        setNewPostContent(''); setNewPostTitle(''); setNewPostImage('');
        setIsPostModalOpen(false);
        toast.success('Post published! 🌾');
        try {
            await axios.post(`${API_BASE}/api/community/posts`, {
                user_name: 'Farmer Ayush', content: newPostContent,
                crop_tag: newPostCrop, image_url: newPostImage
            });
        } catch { }
    };

    // ── Like ───────────────────────────────────────────────────────────────
    const handleLike = (postId) => {
        const post = posts.find(p => p.id === postId);
        const wasLiked = likedPosts[postId];
        setLikedPosts(prev => ({ ...prev, [postId]: !wasLiked }));
        setPosts(prev => prev.map(p =>
            p.id === postId
                ? { ...p, likes: wasLiked ? p.likes - 1 : p.likes + 1 }
                : p
        ));
        
        if (!wasLiked) {
            saveActivity('like', `Liked "${post?.content?.substring(0, 30)}..."`, postId, '#e91e63', '❤️');
        }
        
        try { axios.post(`${API_BASE}/api/community/posts/${postId}/like`); } catch { }
    };

    // ── Comment ────────────────────────────────────────────────────────────
    const handleComment = async (postId) => {
        const text = commentInputs[postId]?.trim();
        if (!text) return;
        const post = posts.find(p => p.id === postId);
        setSubmittingComment(postId);
        const newComment = {
            user: 'Farmer Ayush',
            avatar: 'https://i.pravatar.cc/150?u=ayush',
            text, time: 'Just now'
        };
        setPosts(prev => prev.map(p =>
            p.id === postId
                ? { ...p, comments: [...(p.comments || []), newComment] }
                : p
        ));
        saveActivity('comment', `Commented on "${post?.content?.substring(0, 30)}..."`, postId, '#2196f3', '💬');
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setSubmittingComment(null);
        try {
            await axios.post(`${API_BASE}/api/community/posts/${postId}/comment`, {
                user_name: 'Farmer Ayush', text
            });
        } catch { }
    };

    const handleShare = (postId) => {
        navigator.clipboard.writeText(`${window.location.origin}/community?post=${postId}`);
        toast.success('Link copied! 🔗');
    };

    const cropColor = (tag) => CROP_COLORS[tag] || CROP_COLORS.Default;

    return (
        <>
            <Toaster position="top-right" />
            <div className="community-container animate-fade-in">

                {/* ── Header ── */}
                <div className="community-header glass-card">
                    <div className="community-intro">
                        <h1>🌾 Farmer Community</h1>
                        <p>Share knowledge, ask questions &amp; grow together</p>
                    </div>
                </div>

                {/* ── Crop Filter ── */}
                <div className="crop-filter-wrapper glass-card sticky-filter">
                    <div className="filter-label"><HiFilter /> Filter:</div>
                    <div className="crop-filters">
                        {crops.map(crop => (
                            <button
                                key={crop}
                                className={`filter-chip ${selectedCrop === crop ? 'active' : ''}`}
                                onClick={() => setSelectedCrop(crop)}
                            >{crop}</button>
                        ))}
                    </div>
                </div>

                {/* ── Feed ── */}
                <div className="feed-container">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="post-skeleton skeleton" />)
                    ) : filtered.length === 0 ? (
                        <div className="no-posts-msg glass-card">No posts for {selectedCrop} yet. Be the first!</div>
                    ) : (
                        filtered.map(post => {
                            const isLiked = likedPosts[post.id];
                            const isExpanded = expandedPostId === post.id;
                            const cc = cropColor(post.crop_tag);
                            return (
                                <div
                                    key={post.id}
                                    ref={el => postRefs.current[post.id] = el}
                                    className={`comm-post-card glass-card ${highlightedId === post.id ? 'post-highlighted' : ''}`}
                                >

                                    {/* Card Top: avatar + meta + tag */}
                                    <div className="comm-post-header">
                                        <img src={post.user_image} alt={post.user_name} className="comm-avatar" />
                                        <div className="comm-user-meta">
                                            <span className="comm-user-name">{post.user_name}</span>
                                            <span className="comm-post-time">{timeAgo(post.timestamp)}</span>
                                        </div>
                                        <span className="comm-crop-tag" style={{ background: `${cc}18`, color: cc }}>
                                            {post.crop_tag}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <p className="comm-post-content">{post.content}</p>

                                    {post.image_url && (
                                        <img src={post.image_url} alt="post" className="comm-post-image" />
                                    )}

                                    {/* Action Bar */}
                                    <div className="comm-action-bar">
                                        <button
                                            className={`comm-action like ${isLiked ? 'liked' : ''}`}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <HiHeart className="comm-action-icon" />
                                            <span>{post.likes}</span>
                                        </button>

                                        <button
                                            className={`comm-action comment ${isExpanded ? 'active' : ''}`}
                                            onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                                        >
                                            <HiAnnotation className="comm-action-icon" />
                                            <span>{post.comments?.length || 0} Comment{post.comments?.length !== 1 ? 's' : ''}</span>
                                        </button>

                                        <button className="comm-action share" onClick={() => handleShare(post.id)}>
                                            <HiShare className="comm-action-icon" />
                                            <span>Share</span>
                                        </button>
                                    </div>

                                    {/* ── Comments Panel ── */}
                                    {isExpanded && (
                                        <div className="comm-comments-panel animate-slide-down">
                                            <div className="comm-comments-list">
                                                {post.comments?.length > 0 ? (
                                                    post.comments.map((c, i) => (
                                                        <div key={i} className="comm-comment-item">
                                                            <img
                                                                src={c.avatar || `https://i.pravatar.cc/150?u=${c.user}`}
                                                                alt={c.user}
                                                                className="comm-comment-avatar"
                                                            />
                                                            <div className="comm-comment-bubble">
                                                                <div className="comm-comment-header">
                                                                    <strong>{c.user}</strong>
                                                                    <span className="comm-comment-time">{c.time}</span>
                                                                </div>
                                                                <p>{c.text}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="comm-no-comments">No comments yet — start the discussion!</p>
                                                )}
                                            </div>

                                            {/* Comment Input */}
                                            <div className="comm-comment-input-row">
                                                <img
                                                    src="https://i.pravatar.cc/150?u=ayush"
                                                    alt="You"
                                                    className="comm-comment-avatar"
                                                />
                                                <div className="comm-comment-input-wrap">
                                                    <input
                                                        ref={el => commentInputRef.current[post.id] = el}
                                                        className="comm-comment-input"
                                                        placeholder="Write a comment..."
                                                        value={commentInputs[post.id] || ''}
                                                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                        onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                                                    />
                                                    <button
                                                        className={`comm-send-btn ${commentInputs[post.id]?.trim() ? 'active' : ''}`}
                                                        onClick={() => handleComment(post.id)}
                                                        disabled={submittingComment === post.id}
                                                    >
                                                        <HiPaperAirplane />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── FAB New Post ── */}
            <button className="fab-pencil" onClick={() => setIsPostModalOpen(true)} title="Create Post">
                <HiPencil className="fab-icon" />
                <span className="fab-text">New Post</span>
            </button>

            {/* ── Create Post Modal ── */}
            {isPostModalOpen && (
                <div className="modal-overlay" onClick={() => setIsPostModalOpen(false)}>
                    <div className="create-post-modal glass-card animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-user-row">
                                <img src="https://i.pravatar.cc/150?u=ayush" alt="You" className="modal-avatar" />
                                <div>
                                    <strong>Farmer Ayush</strong>
                                    <p className="modal-posting-to">Posting to Farmer Community</p>
                                </div>
                            </div>
                            <button className="close-modal" onClick={() => setIsPostModalOpen(false)}>
                                <HiX />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost}>
                            {/* Crop Tag Selector */}
                            <div className="modal-crop-row">
                                {crops.filter(c => c !== 'All').map(crop => (
                                    <button
                                        key={crop} type="button"
                                        className={`modal-crop-chip ${newPostCrop === crop ? 'selected' : ''}`}
                                        style={newPostCrop === crop ? { background: cropColor(crop), color: '#fff' } : {}}
                                        onClick={() => setNewPostCrop(crop)}
                                    >{crop}</button>
                                ))}
                            </div>

                            {/* Content */}
                            <textarea
                                className="modal-textarea"
                                placeholder="What's on your mind? Share a tip, question, or success story with fellow farmers... 🌾"
                                value={newPostContent}
                                onChange={e => setNewPostContent(e.target.value)}
                                required
                                rows={5}
                            />

                            {/* Image Preview */}
                            {newPostImage && (
                                <div className="modal-image-preview">
                                    <img src={newPostImage} alt="Selected" />
                                    <button type="button" className="remove-image" onClick={() => setNewPostImage('')}>
                                        <HiX />
                                    </button>
                                </div>
                            )}

                            <div className="modal-footer">
                                <div className="footer-left">
                                    <input type="file" id="post-image-upload" accept="image/*" hidden
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setNewPostImage(reader.result);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label htmlFor="post-image-upload" className="attach-btn">
                                        <HiPhotograph /> Add Photo
                                    </label>
                                </div>
                                <div className="footer-right">
                                    <button type="button" onClick={() => setIsPostModalOpen(false)} className="btn-cancel">Cancel</button>
                                    <button type="submit" className="btn-post" disabled={!newPostContent.trim()}>
                                        <HiPaperAirplane /> Post
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Community;
