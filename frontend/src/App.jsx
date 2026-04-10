import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Market from './pages/Market';
import Community from './pages/Community';
import Profile from './pages/Profile';
import UserPosts from './pages/UserPosts';
import Navbar from './components/Navbar';
import VoiceConsult from './components/VoiceConsult';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Predict />} />
            <Route path="/market" element={<Market />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/posts" element={<UserPosts />} />
          </Routes>
        </main>
        {/* Global floating AI voice call button */}
        <VoiceConsult />
      </div>
    </Router>
  );
}

export default App;

