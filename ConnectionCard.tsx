import { UserPlus, UserCheck, X } from 'lucide-react';
import { Profile } from '../lib/supabase';

interface ConnectionCardProps {
  profile: Profile;
  connectionStatus?: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  onConnect?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

export function ConnectionCard({
  profile,
  connectionStatus = 'none',
  onConnect,
  onAccept,
  onReject,
  loading = false,
}: ConnectionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{profile.full_name}</h3>
          {profile.headline && (
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{profile.headline}</p>
          )}
          {profile.location && (
            <p className="text-xs text-slate-500">{profile.location}</p>
          )}

          <div className="mt-4 flex gap-2">
            {connectionStatus === 'none' && onConnect && (
              <button
                onClick={onConnect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
            )}

            {connectionStatus === 'pending_sent' && (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg cursor-default"
              >
                <UserCheck className="w-4 h-4" />
                Pending
              </button>
            )}

            {connectionStatus === 'pending_received' && onAccept && onReject && (
              <>
                <button
                  onClick={onAccept}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={onReject}
                  disabled={loading}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}

            {connectionStatus === 'accepted' && (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg cursor-default"
              >
                <UserCheck className="w-4 h-4" />
                Connected
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
