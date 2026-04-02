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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
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



