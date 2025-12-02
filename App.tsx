import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Heart, User, Search, TreePine } from 'lucide-react';
import PostCard from './components/PostCard';
import ComposeModal from './components/ComposeModal';
import { Post, Comment, Tab, MOODS } from './types';
import { getTreeHoleResponse } from './services/geminiService';

// --- Mock Data Initialization ---
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content: "有时候觉得长大真的很累，要伪装成情绪稳定的样子。其实我只想躲在被子里哭一场。",
    mood: 'sad',
    createdAt: Date.now() - 3600000,
    likes: 42,
    isLiked: false,
    isSaved: false,
    comments: [
      { id: 'c1', content: "抱抱你，想哭就哭出来吧，这里没人认识你。", createdAt: Date.now() - 1800000, authorAlias: "陌生的兔子" }
    ],
    aiResponse: "没关系呀，眼泪是心灵的雨水。在被子里做回小孩，树洞会为你挡住外面的风。",
    bgColor: 'bg-blue-50/50'
  },
  {
    id: '2',
    content: "今天在路边喂了一只流浪猫，它蹭了我的裤脚。突然觉得世界也没那么糟糕。",
    mood: 'grateful',
    createdAt: Date.now() - 7200000,
    likes: 128,
    isLiked: true,
    isSaved: true,
    comments: [],
    aiResponse: "善意是双向的暖流。猫咪把它的信任交给你，你也把温柔留给了世界。",
    bgColor: 'bg-orange-50/50'
  },
  {
    id: '3',
    content: "马上要考试了，虽然复习了很久，但还是很焦虑，怕对不起父母的期待。",
    mood: 'anxious',
    createdAt: Date.now() - 86400000,
    likes: 15,
    isLiked: false,
    isSaved: false,
    comments: [],
    bgColor: 'bg-purple-50/50'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Actions ---

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id 
        ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
        : p
    ));
  };

  const handleSave = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, isSaved: !p.isSaved } : p
    ));
  };

  const handleComment = (id: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content: text,
      createdAt: Date.now(),
      authorAlias: "我"
    };
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  };

  const handleSubmitPost = async (content: string, mood: Post['mood']) => {
    setIsSubmitting(true);
    
    // Simulate API delay and get AI response
    const aiRes = await getTreeHoleResponse(content, mood);
    
    const moodConfig = MOODS.find(m => m.type === mood) || MOODS[0];
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      mood,
      createdAt: Date.now(),
      likes: 0,
      isLiked: false,
      isSaved: false,
      comments: [],
      bgColor: `${moodConfig.color}/50`, // Add opacity
      aiResponse: aiRes
    };

    setPosts(prev => [newPost, ...prev]);
    setIsSubmitting(false);
    setIsComposeOpen(false);
    setActiveTab('home');
  };

  // --- Filtering ---
  const displayedPosts = activeTab === 'saved' 
    ? posts.filter(p => p.isSaved) 
    : posts;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 pb-24 max-w-2xl mx-auto border-x border-stone-100 shadow-2xl shadow-stone-200/50">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center text-white">
            <TreePine size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">树洞</h1>
            <p className="text-xs text-stone-500 font-medium">倾听你的每一个声音</p>
          </div>
        </div>
        <button className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
          <Search size={24} />
        </button>
      </header>

      {/* Main Feed */}
      <main className="px-4 py-6">
        <AnimatePresence mode="popLayout">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                onComment={handleComment}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 text-stone-400"
            >
              <div className="mb-4 flex justify-center">
                <TreePine size={48} className="opacity-20" />
              </div>
              <p>这里还是一片荒原，种下第一颗种子吧。</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 lg:right-[calc(50%-18rem)] z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsComposeOpen(true)}
          className="w-14 h-14 bg-stone-800 text-white rounded-full shadow-lg shadow-stone-800/30 flex items-center justify-center hover:bg-stone-900 transition-colors"
        >
          <Plus size={28} />
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-100 px-6 py-4 z-40 max-w-2xl mx-auto">
        <div className="flex justify-around items-center">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={24} />} 
            label="首页" 
          />
          <NavButton 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')} 
            icon={<Heart size={24} />} 
            label="收藏" 
          />
          <NavButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User size={24} />} 
            label="我的" 
          />
        </div>
      </nav>

      <AnimatePresence>
        {isComposeOpen && (
          <ComposeModal
            isOpen={isComposeOpen}
            onClose={() => setIsComposeOpen(false)}
            onSubmit={handleSubmitPost}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Component for Navigation
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
  >
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default App;