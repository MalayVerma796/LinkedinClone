import { useEffect, useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { supabase, Profile, Connection } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ConnectionCard } from '../components/ConnectionCard';

export function NetworkPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'connections' | 'requests'>('suggestions');
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [connections, setConnections] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<(Connection & { profiles?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (activeTab === 'suggestions') {
        await loadSuggestions();
      } else if (activeTab === 'connections') {
        await loadConnections();
      } else if (activeTab === 'requests') {
        await loadRequests();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    if (!user) return;

    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id);

    if (profilesError) throw profilesError;

    const { data: existingConnections, error: connectionsError } = await supabase
      .from('connections')
      .select('connected_user_id')
      .eq('user_id', user.id);

    if (connectionsError) throw connectionsError;

    const connectedIds = new Set(existingConnections?.map((c) => c.connected_user_id) || []);
    const filtered = allProfiles?.filter((p) => !connectedIds.has(p.id)) || [];

    setSuggestions(filtered);
  };

  const loadConnections = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('connections')
      .select('connected_user_id')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    if (error) throw error;

    const connectedIds = data?.map((c) => c.connected_user_id) || [];

    if (connectedIds.length === 0) {
      setConnections([]);
      return;
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', connectedIds);

    if (profilesError) throw profilesError;

    setConnections(profiles || []);
  };

  const loadRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('connections')
      .select('*, profiles(*)')
      .eq('connected_user_id', user.id)
      .eq('status', 'pending');

    if (error) throw error;

    setRequests(data || []);
  };

  const handleConnect = async (profileId: string) => {
    if (!user) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('connections')
        .insert([
          {
            user_id: user.id,
            connected_user_id: profileId,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      await loadSuggestions();
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async (connectionId: string, userId: string) => {
    if (!user) return;

    setActionLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (updateError) throw updateError;

      const { error: insertError } = await supabase
        .from('connections')
        .insert([
          {
            user_id: user.id,
            connected_user_id: userId,
            status: 'accepted',
          },
        ]);

      if (insertError) throw insertError;

      await loadRequests();
    } catch (error) {
      console.error('Error accepting connection:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (connectionId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId);

      if (error) throw error;

      await loadRequests();
    } catch (error) {
      console.error('Error rejecting connection:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Network</h1>
        <p className="text-slate-600">Grow your professional network</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'suggestions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Suggestions
            </div>
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'connections'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Connections
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Requests
              {requests.length > 0 && (
                <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-slate-600">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTab === 'suggestions' &&
            (suggestions.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-slate-600">No suggestions available</p>
              </div>
            ) : (
              suggestions.map((profile) => (
                <ConnectionCard
                  key={profile.id}
                  profile={profile}
                  connectionStatus="none"
                  onConnect={() => handleConnect(profile.id)}
                  loading={actionLoading}
                />
              ))
            ))}

          {activeTab === 'connections' &&
            (connections.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-slate-600">No connections yet</p>
              </div>
            ) : (
              connections.map((profile) => (
                <ConnectionCard
                  key={profile.id}
                  profile={profile}
                  connectionStatus="accepted"
                />
              ))
            ))}

          {activeTab === 'requests' &&
            (requests.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-slate-600">No pending requests</p>
              </div>
            ) : (
              requests.map((request) =>
                request.profiles ? (
                  <ConnectionCard
                    key={request.id}
                    profile={request.profiles}
                    connectionStatus="pending_received"
                    onAccept={() => handleAccept(request.id, request.user_id)}
                    onReject={() => handleReject(request.id)}
                    loading={actionLoading}
                  />
                ) : null
              )
            ))}
        </div>
      )}
    </div>
  );
}
