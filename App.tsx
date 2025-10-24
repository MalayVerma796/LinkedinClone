import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Navbar } from './components/Navbar';
import { FeedPage } from './pages/FeedPage';
import { NetworkPage } from './pages/NetworkPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'feed' | 'network' | 'profile'>('feed');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {currentPage === 'feed' && <FeedPage />}
        {currentPage === 'network' && <NetworkPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
