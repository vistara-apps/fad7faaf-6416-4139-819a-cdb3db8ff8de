/**
 * X402 Payment Flow Test Utilities
 * 
 * This file contains utilities for testing the x402 payment flow
 * integration with wagmi and USDC on Base.
 */

import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { base } from 'wagmi/chains';
import { parseUnits, formatUnits } from 'viem';

// USDC contract address on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Test configuration
export const TEST_CONFIG = {
  chainId: base.id,
  tokenAddress: USDC_ADDRESS,
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.educonnect.app',
  testAmounts: ['5.00', '10.00', '25.00', '50.00'], // Test amounts in USDC
};

/**
 * Create a configured x402 client for testing
 */
export function createTestX402Client() {
  const client = axios.create({
    baseURL: TEST_CONFIG.baseURL,
  });
  
  // Add x402 payment interceptor (note: walletClient would be needed in real usage)
  // withPaymentInterceptor(client, walletClient); // Commented out for testing without real wallet
  
  return client;
}

/**
 * Test payment request creation
 */
export async function testPaymentRequestCreation(
  amount: string,
  description: string,
  userAddress: string
) {
  const client = createTestX402Client();
  
  try {
    const paymentAmount = parseUnits(amount, 6); // USDC has 6 decimals
    
    const response = await client.post('/payments', {
      amount: paymentAmount.toString(),
      currency: 'USDC',
      description,
      metadata: {
        userAddress,
        timestamp: Date.now(),
        testMode: true,
      },
    });
    
    const paymentRequest = response.data;

    console.log('✅ Payment request created successfully:', {
      id: paymentRequest.id,
      amount: formatUnits(BigInt(paymentRequest.amount), 6),
      recipient: paymentRequest.recipient,
      description: paymentRequest.description,
    });

    return paymentRequest;
  } catch (error) {
    console.error('❌ Payment request creation failed:', error);
    throw error;
  }
}

/**
 * Test payment verification
 */
export async function testPaymentVerification(
  paymentId: string,
  txHash: string
) {
  const client = createTestX402Client();
  
  try {
    const response = await client.post('/payments/verify', {
      paymentId,
      txHash,
    });
    
    const verification = response.data;

    console.log('✅ Payment verification successful:', verification);
    return verification;
  } catch (error) {
    console.error('❌ Payment verification failed:', error);
    throw error;
  }
}

/**
 * Test end-to-end payment flow (without actual transaction)
 */
export async function testPaymentFlowE2E(
  amount: string,
  description: string,
  userAddress: string
) {
  console.log('🧪 Starting end-to-end payment flow test...');
  
  try {
    // Step 1: Create payment request
    console.log('📝 Step 1: Creating payment request...');
    const paymentRequest = await testPaymentRequestCreation(
      amount,
      description,
      userAddress
    );

    // Step 2: Simulate transaction (in real flow, this would be done by wallet)
    console.log('💳 Step 2: Simulating transaction...');
    const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    console.log('🔗 Mock transaction hash:', mockTxHash);

    // Step 3: Verify payment (this would normally wait for real tx confirmation)
    console.log('✅ Step 3: Verifying payment...');
    // Note: In test mode, we skip actual verification since we don't have a real tx
    console.log('⚠️  Skipping verification in test mode (no real transaction)');

    console.log('🎉 End-to-end test completed successfully!');
    
    return {
      paymentRequest,
      mockTxHash,
      success: true,
    };
  } catch (error) {
    console.error('❌ End-to-end test failed:', error);
    throw error;
  }
}

/**
 * Validate USDC balance for payment
 */
export function validateUSDCBalance(
  balance: bigint,
  requiredAmount: string
): { isValid: boolean; message: string } {
  const required = parseUnits(requiredAmount, 6);
  const available = balance;

  if (available >= required) {
    return {
      isValid: true,
      message: `✅ Sufficient balance: ${formatUnits(available, 6)} USDC available, ${requiredAmount} USDC required`,
    };
  } else {
    return {
      isValid: false,
      message: `❌ Insufficient balance: ${formatUnits(available, 6)} USDC available, ${requiredAmount} USDC required`,
    };
  }
}

/**
 * Format payment amount for display
 */
export function formatPaymentAmount(amount: string | bigint, decimals = 6): string {
  if (typeof amount === 'string') {
    return `${amount} USDC`;
  }
  return `${formatUnits(amount, decimals)} USDC`;
}

/**
 * Get Base network explorer URL for transaction
 */
export function getTransactionURL(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

/**
 * Test configuration validation
 */
export function validateTestConfiguration(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!TEST_CONFIG.baseURL) {
    errors.push('Missing API base URL');
  }

  if (!TEST_CONFIG.chainId) {
    errors.push('Missing chain ID');
  }

  if (!TEST_CONFIG.tokenAddress || !TEST_CONFIG.tokenAddress.startsWith('0x')) {
    errors.push('Invalid USDC token address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Run all tests
 */
export async function runAllTests(userAddress: string) {
  console.log('🚀 Running comprehensive x402 payment flow tests...');
  
  // Validate configuration
  const configValidation = validateTestConfiguration();
  if (!configValidation.isValid) {
    console.error('❌ Configuration validation failed:', configValidation.errors);
    return;
  }
  console.log('✅ Configuration validation passed');

  // Test each amount
  for (const amount of TEST_CONFIG.testAmounts) {
    console.log(`\n💰 Testing payment amount: ${amount} USDC`);
    try {
      await testPaymentFlowE2E(
        amount,
        `Test payment for ${amount} USDC`,
        userAddress
      );
    } catch (error) {
      console.error(`❌ Test failed for amount ${amount}:`, error);
    }
  }

  console.log('\n🏁 All tests completed!');
}
