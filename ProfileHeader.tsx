import { useState } from 'react';
import { Camera, MapPin, Edit2, X } from 'lucide-react';
import { Profile } from '../lib/supabase';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  onUpdate?: (updates: Partial<Profile>) => Promise<void>;
}

export function ProfileHeader({ profile, isOwnProfile, onUpdate }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!onUpdate) return;
    setLoading(true);
    try {
      await onUpdate(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
        {profile.banner_url && (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        )}
        {isOwnProfile && !isEditing && (
          <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-lg transition">
            <Camera className="w-5 h-5 text-slate-700" />
          </button>
        )}
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-start justify-between -mt-16 mb-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-semibold">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isOwnProfile && !isEditing && (
              <button className="absolute bottom-0 right-0 bg-white hover:bg-slate-50 p-2 rounded-full shadow-lg border border-slate-200 transition">
                <Camera className="w-4 h-4 text-slate-700" />
              </button>
            )}
          </div>

          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-16 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editedProfile.full_name}
                onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={editedProfile.headline}
                onChange={(e) => setEditedProfile({ ...editedProfile, headline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer at Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About</label>
              <textarea
                value={editedProfile.about}
                onChange={(e) => setEditedProfile({ ...editedProfile, about: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(profile);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{profile.full_name}</h1>
            {profile.headline && (
              <p className="text-slate-700 mb-2">{profile.headline}</p>
            )}
            {profile.location && (
              <div className="flex items-center gap-1 text-slate-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            {profile.about && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
                <p className="text-slate-700 whitespace-pre-wrap">{profile.about}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
