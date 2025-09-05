'use client';

import { useState, useEffect } from 'react';
import { FrameHeader } from '@/components/layout/FrameHeader';
import { Navigation } from '@/components/layout/Navigation';
import { Dashboard } from '@/components/features/Dashboard';
import { StudyGroups } from '@/components/features/StudyGroups';
import { Circles } from '@/components/features/Circles';
import { PaymentDemo } from '@/components/features/PaymentDemo';
import { StudyHelp } from '@/components/features/StudyHelp';
import { Profile } from '@/components/features/Profile';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function EduConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    // Signal that the frame is ready
    setFrameReady();
  }, [setFrameReady]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'study-groups':
        return <StudyGroups />;
      case 'circles':
        return <Circles />;
      case 'payments':
        return <PaymentDemo />;
      case 'help':
        return <StudyHelp />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <FrameHeader />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}
