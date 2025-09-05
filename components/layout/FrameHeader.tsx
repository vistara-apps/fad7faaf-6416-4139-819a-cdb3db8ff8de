'use client';

import { APP_CONFIG } from '@/lib/constants';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';
import { GraduationCap } from 'lucide-react';

export function FrameHeader() {
  return (
    <header className="glass-card rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{APP_CONFIG.name}</h1>
            <p className="text-sm text-text-secondary">{APP_CONFIG.tagline}</p>
          </div>
        </div>
        
        <Wallet>
          <ConnectWallet>
            <Name className="text-sm font-medium" />
          </ConnectWallet>
        </Wallet>
      </div>
    </header>
  );
}
