export interface Comment {
  id: string;
  content: string;
  createdAt: number;
  authorAlias: string;
}

export interface Post {
  id: string;
  content: string;
  mood: 'sad' | 'happy' | 'angry' | 'anxious' | 'neutral' | 'grateful';
  createdAt: number;
  likes: number;
  isLiked: boolean; // Local state simulation
  isSaved: boolean; // Local state simulation
  comments: Comment[];
  aiResponse?: string; // The gentle echo from the tree hole
  bgColor: string;
}

export type Tab = 'home' | 'write' | 'saved' | 'profile';

export const MOODS: { type: Post['mood']; label: string; icon: string; color: string }[] = [
  { type: 'neutral', label: '平静', icon: '🍃', color: 'bg-stone-100' },
  { type: 'sad', label: '难过', icon: '🌧️', color: 'bg-blue-50' },
  { type: 'happy', label: '开心', icon: '✨', color: 'bg-yellow-50' },
  { type: 'anxious', label: '焦虑', icon: '🌀', color: 'bg-purple-50' },
  { type: 'angry', label: '生气', icon: '🔥', color: 'bg-red-50' },
  { type: 'grateful', label: '感恩', icon: '🙏', color: 'bg-orange-50' },
];