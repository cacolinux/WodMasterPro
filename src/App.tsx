/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { WODList } from './components/wod/WODList';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { Login } from './components/auth/Login';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'wod':
        return <WODList />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'schedule':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <span className="text-2xl font-bold text-zinc-100 italic">S</span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-100">Schedule Coming Soon</h2>
            <p className="max-w-md text-center">We're building a powerful scheduling system to manage your classes and bookings.</p>
          </div>
        );
      case 'athletes':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <span className="text-2xl font-bold text-zinc-100 italic">A</span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-100">Athlete Management Coming Soon</h2>
            <p className="max-w-md text-center">Manage your community, track memberships, and communicate with your athletes.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <span className="text-2xl font-bold text-zinc-100 italic">S</span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-100">Settings Coming Soon</h2>
            <p className="max-w-md text-center">Configure your box details, membership plans, and system preferences.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}



