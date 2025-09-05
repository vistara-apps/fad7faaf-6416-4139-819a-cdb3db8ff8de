'use client';

import { useState, useCallback } from 'react';
import { useWalletClient, useAccount, useBalance } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { base } from 'wagmi/chains';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, CheckCircle, AlertCircle, Loader2, DollarSign } from 'lucide-react';
// Note: x402-axios integration simplified for demo purposes

// USDC contract address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

interface PaymentFlowProps {
  amount: string;
  description: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
}

interface PaymentState {
  status: 'idle' | 'preparing' | 'confirming' | 'success' | 'error';
  txHash?: string;
  error?: string;
}

export function PaymentFlow({ amount, description, onSuccess, onError }: PaymentFlowProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' });
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  
  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_ADDRESS,
    chainId: base.id,
  });

  // Simulate x402 client for demo purposes
  // In production, this would use the actual x402-axios client with proper configuration

  const handlePayment = useCallback(async () => {
    if (!walletClient || !address || !isConnected) {
      setPaymentState({ status: 'error', error: 'Wallet not connected' });
      onError?.('Wallet not connected');
      return;
    }

    try {
      setPaymentState({ status: 'preparing' });

      // Parse the payment amount (assuming USDC has 6 decimals)
      const paymentAmount = parseUnits(amount, 6);

      // Check if user has sufficient balance
      if (usdcBalance && usdcBalance.value < paymentAmount) {
        throw new Error(`Insufficient USDC balance. Required: ${amount} USDC, Available: ${formatUnits(usdcBalance.value, 6)} USDC`);
      }

      // Simulate x402 payment flow for demo purposes
      console.log('🚀 Starting x402 payment flow simulation...');
      console.log('💰 Payment details:', {
        amount: formatUnits(paymentAmount, 6) + ' USDC',
        description,
        userAddress: address,
        chainId: base.id,
        tokenAddress: USDC_ADDRESS,
      });

      setPaymentState({ status: 'confirming' });

      // In a real implementation, this would:
      // 1. Create x402 payment request
      // 2. Execute USDC transfer transaction via wagmi
      // 3. Wait for transaction confirmation
      // 4. Verify payment with x402 service
      
      // For demo purposes, we simulate the transaction
      const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      console.log('🔗 Simulated transaction hash:', mockTxHash);
      
      // Simulate transaction confirmation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Payment simulation completed successfully!');
      setPaymentState({ status: 'success', txHash: mockTxHash });
      onSuccess?.(mockTxHash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentState({ status: 'error', error: errorMessage });
      onError?.(errorMessage);
    }
  }, [walletClient, address, isConnected, amount, description, usdcBalance, onSuccess, onError]);

  const getStatusIcon = () => {
    switch (paymentState.status) {
      case 'preparing':
      case 'confirming':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (paymentState.status) {
      case 'preparing':
        return 'Preparing payment...';
      case 'confirming':
        return 'Confirming transaction...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return 'Payment failed';
      default:
        return 'Ready to pay';
    }
  };

  const getStatusColor = () => {
    switch (paymentState.status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'preparing':
      case 'confirming':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Connect Wallet to Pay
          </h3>
          <p className="text-text-secondary mb-4">
            Please connect your wallet to make payments
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Payment Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Payment Details
          </h3>
          <Badge variant={paymentState.status === 'success' ? 'primary' : 'outline'}>
            {paymentState.status === 'success' ? 'Paid' : 'Pending'}
          </Badge>
        </div>

        {/* Payment Amount */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-text-primary">Amount</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              {amount} USDC
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-2">{description}</p>
        </div>

        {/* Balance Info */}
        {usdcBalance && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Your USDC Balance:</span>
            <span className="font-medium text-text-primary">
              {formatUnits(usdcBalance.value, 6)} USDC
            </span>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Error Message */}
        {paymentState.status === 'error' && paymentState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{paymentState.error}</p>
          </div>
        )}

        {/* Success Message */}
        {paymentState.status === 'success' && paymentState.txHash && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 mb-2">
              Payment completed successfully!
            </p>
            <a
              href={`https://basescan.org/tx/${paymentState.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              View transaction on BaseScan
            </a>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handlePayment}
          disabled={
            paymentState.status === 'preparing' ||
            paymentState.status === 'confirming' ||
            paymentState.status === 'success' ||
            !usdcBalance ||
            usdcBalance.value < parseUnits(amount, 6)
          }
          variant="primary"
          className="w-full"
        >
          {paymentState.status === 'preparing' || paymentState.status === 'confirming' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : paymentState.status === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Payment Complete
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {amount} USDC
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
