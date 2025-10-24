import { useEffect, useState } from 'react';
import { supabase, Post, Profile } from '../lib/supabase';
import { CreatePost } from '../components/CreatePost';
import { PostCard } from '../components/PostCard';

export function FeedPage() {
  const [posts, setPosts] = useState<(Post & { profiles?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <CreatePost onPostCreated={loadPosts} />

      {loading ? (
        <div className="text-center py-12">
          <div className="text-slate-600">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-slate-600">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))}
        </div>
      )}
    </div>
  );
}
