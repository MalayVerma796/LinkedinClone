import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile } from '../lib/supabase';
import { ProfileHeader } from '../components/ProfileHeader';

export function ProfilePage() {
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserProfile) {
      setProfile(currentUserProfile);
      setLoading(false);
    }
  }, [currentUserProfile]);

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader
        profile={profile}
        isOwnProfile={true}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
}
