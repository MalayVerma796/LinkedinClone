import { useState } from 'react';
import { ThumbsUp, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { Post, Profile, Comment, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post & { profiles?: Profile };
  onUpdate: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<(Comment & { profiles?: Profile })[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const loadComments = async () => {
    if (comments.length > 0) return;

    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(*)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);

        if (error) throw error;
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, post_id: post.id }]);

        if (error) throw error;
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            user_id: user.id,
            post_id: post.id,
            content: newComment.trim(),
          },
        ]);

      if (error) throw error;

      setNewComment('');
      await loadComments();
      onUpdate();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const profile = post.profiles;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
              {profile?.full_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-900">{profile?.full_name}</h3>
            {profile?.headline && (
              <p className="text-sm text-slate-600">{profile.headline}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <p className="text-slate-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full rounded-lg mb-4" />
      )}

      <div className="flex items-center gap-4 py-3 border-t border-b border-slate-200 mb-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isLiked
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments_count}</span>
        </button>
      </div>

      {showComments && (
        <div className="space-y-4">
          {loadingComments ? (
            <p className="text-sm text-slate-500 text-center py-4">Loading comments...</p>
          ) : (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.full_name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {comment.profiles?.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-slate-900 text-sm">
                        {comment.profiles?.full_name}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
