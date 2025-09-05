'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-text-secondary mb-6">
            We encountered an error while loading EduConnect. Don't worry, your study squad is still here!
          </p>
          <div className="space-y-3">
            <Button variant="primary" onClick={reset} className="w-full">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              Go Home
            </Button>
          </div>
          {error.digest && (
            <p className="text-xs text-text-secondary mt-4">
              Error ID: {error.digest}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
