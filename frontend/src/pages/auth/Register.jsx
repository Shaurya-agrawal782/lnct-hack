import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthShell from '../../components/auth/AuthShell';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ArrowRight, ShieldAlert } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { register, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Call registration API (excluding role, which defaults to citizen)
      await register(name, email, password, undefined, phone);
      // 2. Perform automatic login to fetch session cookie
      await login(email, password);
      // 3. Transition to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <AuthShell>
      <div className="space-y-6">
        {/* Title Block */}
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Citizen Registration
          </h1>
          <p className="text-on-surface-variant text-sm">
            Create a profile to report hazards and receive local critical alerts.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface-variant leading-relaxed">
          <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-primary">
            Citizen Account Policy
          </span>
          Public accounts are created as <strong>Citizen</strong> profiles. Responder and agency operator accounts are managed by local coordinators.
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-error-container/40 border border-error/20 rounded-xl flex items-start gap-3 text-sm text-on-error-container">
            <ShieldAlert className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block font-sans" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Johnson"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon="person"
              autoComplete="name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block font-sans" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="alex@domain.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="mail"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block font-sans" htmlFor="phone">
              Phone Number <span className="text-outline text-[11px] font-normal lowercase">(optional)</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon="call"
              autoComplete="tel"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block font-sans" htmlFor="password">
              Secure Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="lock"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center h-12 shadow-sm font-semibold transition-all mt-2"
            variant="primary"
          >
            <span>{loading ? 'Creating Account...' : 'Create Citizen Profile'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Footer Options */}
        <div className="pt-6 border-t border-outline-variant space-y-3 text-center lg:text-left text-sm">
          <div className="text-on-surface-variant">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Access Command Center
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
