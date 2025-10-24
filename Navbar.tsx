import { Home, Users, User, LogOut, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPage: 'feed' | 'network' | 'profile';
  onNavigate: (page: 'feed' | 'network' | 'profile') => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">ProNetwork</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('feed')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${
                  currentPage === 'feed'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Home</span>
              </button>

              <button
                onClick={() => onNavigate('network')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${
                  currentPage === 'network'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs font-medium">Network</span>
              </button>

              <button
                className="flex flex-col items-center gap-1 px-6 py-2 text-slate-600 hover:text-slate-900 rounded-lg transition"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-xs font-medium">Messages</span>
              </button>

              <button
                className="flex flex-col items-center gap-1 px-6 py-2 text-slate-600 hover:text-slate-900 rounded-lg transition"
              >
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Notifications</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'profile'
                  ? 'bg-slate-100'
                  : 'hover:bg-slate-50'
              }`}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {profile?.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden md:block font-medium text-slate-900">Me</span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-slate-200">
        <div className="flex justify-around py-2">
          <button
            onClick={() => onNavigate('feed')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition ${
              currentPage === 'feed'
                ? 'text-blue-600'
                : 'text-slate-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate('network')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition ${
              currentPage === 'network'
                ? 'text-blue-600'
                : 'text-slate-600'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Network</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition ${
              currentPage === 'profile'
                ? 'text-blue-600'
                : 'text-slate-600'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
