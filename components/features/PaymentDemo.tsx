'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PaymentFlow } from './PaymentFlow';
import { 
  BookOpen, 
  Users, 
  MessageCircle, 
  Star, 
  CreditCard,
  CheckCircle2 
} from 'lucide-react';

interface PaymentOption {
  id: string;
  title: string;
  description: string;
  amount: string;
  icon: React.ComponentType<any>;
  features: string[];
  popular?: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'tutoring',
    title: 'Premium Tutoring Session',
    description: 'Get 1-on-1 help from expert tutors',
    amount: '25.00',
    icon: BookOpen,
    features: [
      '60-minute session',
      'Expert tutor matching',
      'Session recording',
      'Follow-up materials'
    ],
  },
  {
    id: 'study-group',
    title: 'Study Group Premium',
    description: 'Access premium study groups and resources',
    amount: '10.00',
    icon: Users,
    features: [
      'Premium study groups',
      'Advanced collaboration tools',
      'Priority support',
      'Exclusive content'
    ],
    popular: true,
  },
  {
    id: 'consultation',
    title: 'Academic Consultation',
    description: 'Get personalized academic guidance',
    amount: '15.00',
    icon: MessageCircle,
    features: [
      '30-minute consultation',
      'Academic planning',
      'Career guidance',
      'Resource recommendations'
    ],
  },
  {
    id: 'premium',
    title: 'EduConnect Premium',
    description: 'Unlock all premium features',
    amount: '50.00',
    icon: Star,
    features: [
      'All premium features',
      'Unlimited tutoring credits',
      'Priority matching',
      'Advanced analytics',
      'Monthly progress reports'
    ],
  },
];

export function PaymentDemo() {
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
  const [completedPayments, setCompletedPayments] = useState<Set<string>>(new Set());

  const handlePaymentSuccess = (optionId: string, txHash: string) => {
    setCompletedPayments(prev => new Set([...prev, optionId]));
    console.log(`Payment successful for ${optionId}:`, txHash);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const resetDemo = () => {
    setSelectedOption(null);
    setCompletedPayments(new Set());
  };

  if (selectedOption) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            Complete Payment
          </h2>
          <Button
            variant="outline"
            onClick={() => setSelectedOption(null)}
          >
            Back to Options
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <selectedOption.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {selectedOption.title}
              </h3>
              <p className="text-text-secondary mb-4">
                {selectedOption.description}
              </p>
              <div className="space-y-2">
                {selectedOption.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <PaymentFlow
          amount={selectedOption.amount}
          description={`Payment for ${selectedOption.title}`}
          onSuccess={(txHash) => handlePaymentSuccess(selectedOption.id, txHash)}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            💳 Payment Flow Demo
          </h2>
          <p className="text-text-secondary">
            Test the x402 payment flow with USDC on Base
          </p>
        </div>
        {completedPayments.size > 0 && (
          <Button variant="outline" onClick={resetDemo}>
            Reset Demo
          </Button>
        )}
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PAYMENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isCompleted = completedPayments.has(option.id);
          
          return (
            <Card key={option.id} className="p-6 relative">
              {option.popular && (
                <Badge 
                  variant="primary" 
                  className="absolute -top-2 -right-2"
                >
                  Popular
                </Badge>
              )}
              
              {isCompleted && (
                <Badge 
                  variant="primary" 
                  className="absolute -top-2 -left-2"
                >
                  ✓ Paid
                </Badge>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {option.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-2">
                    {option.description}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    ${option.amount} USDC
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {option.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
                {option.features.length > 3 && (
                  <div className="text-sm text-text-secondary">
                    +{option.features.length - 3} more features
                  </div>
                )}
              </div>

              <Button
                onClick={() => setSelectedOption(option)}
                disabled={isCompleted}
                variant={isCompleted ? "outline" : "primary"}
                className="w-full"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Payment Complete
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with USDC
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              About x402 Payments
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Payments are processed using USDC on Base network</p>
              <p>• All transactions are verified on-chain for security</p>
              <p>• Low fees thanks to Base's efficient infrastructure</p>
              <p>• Instant confirmation and receipt generation</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
