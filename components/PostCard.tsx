import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Sparkles, MoreHorizontal } from 'lucide-react';
import { Post, MOODS } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onComment: (id: string, text: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onSave, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const moodConfig = MOODS.find((m) => m.type === post.mood) || MOODS[0];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative w-full mb-6 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${post.bgColor}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={moodConfig.label}>
            {moodConfig.icon}
          </span>
          <span className="text-sm font-medium text-stone-500 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <button className="text-stone-400 hover:text-stone-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <p className="text-stone-800 text-lg leading-relaxed mb-6 whitespace-pre-wrap font-medium">
        {post.content}
      </p>

      {/* AI Response (The Echo) */}
      {post.aiResponse && (
        <div className="mb-6 bg-white/60 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs uppercase tracking-wider font-bold">
            <Sparkles size={14} />
            <span>树洞的回声</span>
          </div>
          <p className="text-stone-600 text-sm italic font-serif leading-relaxed">
            "{post.aiResponse}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-900/5">
        <div className="flex gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              post.isLiked ? 'text-red-400' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
            <span>{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors"
          >
            <MessageCircle size={20} />
            <span>{post.comments.length}</span>
          </button>

          <button
             onClick={() => onSave(post.id)}
             className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
               post.isSaved ? 'text-amber-500' : 'text-stone-400 hover:text-stone-600'
             }`}
          >
            <Bookmark size={20} fill={post.isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <button className="text-stone-400 hover:text-stone-600">
          <Share2 size={18} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-2">
              <div className="space-y-3 mb-4">
                {post.comments.length === 0 ? (
                  <p className="text-center text-stone-400 text-sm py-2">还没有人回应...</p>
                ) : (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="bg-white/40 p-3 rounded-xl text-sm">
                      <div className="flex justify-between text-xs text-stone-400 mb-1">
                        <span>{comment.authorAlias}</span>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-stone-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleCommentSubmit} className="relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的温暖..."
                  className="w-full bg-white/60 border-none rounded-xl py-3 px-4 pr-12 text-sm text-stone-700 placeholder-stone-400 focus:ring-2 focus:ring-stone-200 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 disabled:opacity-30 p-1"
                >
                  <Sparkles size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;