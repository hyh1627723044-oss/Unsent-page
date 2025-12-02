import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOODS, Post } from '../types';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, mood: Post['mood']) => void;
  isSubmitting: boolean;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Post['mood']>('neutral');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              <span>告诉树洞...</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors text-stone-500"
            >
              <X size={20} />
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="这里很安全，什么都可以说..."
            className="w-full flex-1 min-h-[150px] resize-none bg-stone-50 rounded-2xl p-4 text-stone-700 text-lg placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-100 mb-6"
            autoFocus
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-500 mb-3">当下的心情颜色</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {MOODS.map((mood) => (
                <button
                  key={mood.type}
                  onClick={() => setSelectedMood(mood.type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all whitespace-nowrap ${
                    selectedMood === mood.type
                      ? 'border-stone-800 bg-stone-800 text-white shadow-md'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{mood.icon}</span>
                  <span className="text-sm">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSubmit(content, selectedMood)}
            disabled={!content.trim() || isSubmitting}
            className="w-full py-4 bg-stone-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-stone-200"
          >
            {isSubmitting ? (
              <span className="animate-pulse">发送中...</span>
            ) : (
              <>
                <span>投递</span>
                <Send size={18} />
              </>
            )}
          </button>
        </div>
        
        {/* Decorative footer */}
        <div className="h-2 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200" />
      </motion.div>
    </div>
  );
};

export default ComposeModal;