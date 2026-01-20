'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, useAdminSetupNeeded, useCreateInitialAdmin } from '@/hooks/useConvexAdmin';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const { setupNeeded, isLoading: setupLoading } = useAdminSetupNeeded();
  const createInitialAdmin = useCreateInitialAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && !authLoading) {
    router.push('/admin');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await createInitialAdmin({ email, password });
      if (result.success) {
        // Now login with the created credentials
        const loginResult = await login(email, password);
        if (loginResult.success) {
          router.push('/admin');
        }
      } else {
        setError(result.error || 'Setup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || setupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  const showSetup = setupNeeded || isSetupMode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">21|Twenty One</h1>
            <p className="text-slate-500 mt-2">
              {showSetup ? 'Create Admin Account' : 'Admin Login'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={showSetup ? handleSetup : handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : showSetup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {setupNeeded && !isSetupMode && (
            <p className="mt-4 text-center text-sm text-slate-500">
              No admin account exists.{' '}
              <button
                onClick={() => setIsSetupMode(true)}
                className="text-blue-600 hover:underline"
              >
                Create one
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
