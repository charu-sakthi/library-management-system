import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, BookOpen, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLoginForm } from '../utils/validation.js';

export default function LoginPage() {
  const { isAuthenticated, login, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const destination = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  function handleFieldChange(field, value) {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (authError) {
      setAuthError('');
    }
  }

  function handleFillDemo() {
    setEmail('admin@foliolibrary.org');
    setPassword('admin123');
    setErrors({});
    setAuthError('');
    setShowForgotNotice(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setAuthError('');
    try {
      // Prepared for future Spring Boot JWT authentication (/api/auth/login)
      await login({ email, password, rememberMe });
      navigate(destination, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Sign in failed. Please check your details.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[440px]">
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] px-6 py-8 sm:px-10 sm:py-10">
          {/* Top Library Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172554] text-[#D4A853]">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-base font-semibold tracking-tight text-[#172554]">
                Libra – Library Management
              </span>
            </div>

            <div
              className="mt-5 h-px w-12 bg-[#D4A853]"
              aria-hidden="true"
            />

            <h1 className="mt-5 font-display text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 text-balance">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to manage your library.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {authError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{authError}</span>
              </div>
            )}

            {showForgotNotice && (
              <div
                role="status"
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed"
              >
                Password resets are handled by your system administrator. For
                demo access, use{' '}
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="font-medium text-[#172554] underline underline-offset-2 hover:text-slate-900"
                >
                  demo credentials
                </button>
                .
              </div>
            )}

            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="admin@foliolibrary.org"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  className={`w-full h-11 pl-10 pr-3.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                      : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                  }`}
                />
              </div>
              {errors.email && (
                <p id="login-email-error" className="mt-1.5 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'login-password-error' : undefined
                  }
                  className={`w-full h-11 pl-10 pr-11 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
                      : 'border-slate-200 focus:border-[#172554] focus:ring-[#172554]/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="login-password-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-0.5">
              <label
                htmlFor="remember-me"
                className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none"
              >
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#172554] accent-[#172554] focus:ring-[#172554]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotNotice((prev) => !prev)}
                className="text-sm font-medium text-[#172554] hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] rounded"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-11 px-4 text-sm font-medium text-white bg-[#172554] hover:bg-[#1e316b] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2"
            >
              {authLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-500 truncate">
              admin@foliolibrary.org · admin123
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-medium text-[#172554] hover:text-[#D4A853] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] rounded"
            >
              Use demo
            </button>
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-400 tracking-wide">
          Library Management System
        </footer>
      </div>
    </div>
  );
}

