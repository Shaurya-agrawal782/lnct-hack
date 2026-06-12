import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthShell from '../../components/auth/AuthShell';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <AuthShell>
      <div className="space-y-6">
        {/* Title Block */}
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Command Login
          </h1>
          <p className="text-on-surface-variant text-sm">
            Access DisasterConnect agency network & public alerts control.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-error-container/40 border border-error/20 rounded-xl flex items-start gap-3 text-sm text-on-error-container">
            <ShieldAlert className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block" htmlFor="email">
              Operational ID / Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="operator@disasterconnect.dev"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="badge"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block" htmlFor="password">
              Access Code
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="key"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center h-12 shadow-sm font-semibold transition-all"
            variant="primary"
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Footer options */}
        <div className="pt-6 border-t border-outline-variant space-y-3 text-center lg:text-left text-sm">
          <div className="text-on-surface-variant">
            Need public disaster updates?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create Citizen Profile
            </Link>
          </div>
          <div>
            <Link to="/" className="text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center gap-1">
              <span>← Back to Landing Page</span>
            </Link>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
