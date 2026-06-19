import { useState } from 'react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(userId, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-[48%] items-center justify-center bg-lavender-bg">
        <svg width="300" height="340" viewBox="0 0 300 340" fill="none">
          <ellipse cx="150" cy="190" rx="45" ry="65" stroke="#1F2937" strokeWidth="2" fill="none" />
          <polygon points="115,125 150,105 185,125 150,138" stroke="#1F2937" strokeWidth="2" fill="#E5E7EB" />
          <rect x="145" y="115" width="10" height="12" stroke="#1F2937" strokeWidth="2" fill="none" />
          <rect x="120" y="122" width="60" height="2" stroke="#1F2937" strokeWidth="1.5" />
          <circle cx="140" cy="178" r="2.5" fill="#1F2937" />
          <circle cx="160" cy="178" r="2.5" fill="#1F2937" />
          <path d="M140 190 Q150 198 160 190" stroke="#1F2937" strokeWidth="1.5" fill="none" />
          <path d="M180 210 L200 215 L210 218" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M120 210 L100 215 L90 218" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="50" y1="245" x2="250" y2="245" stroke="#1F2937" strokeWidth="2" />
          <line x1="85" y1="245" x2="85" y2="280" stroke="#1F2937" strokeWidth="2" />
          <line x1="215" y1="245" x2="215" y2="280" stroke="#1F2937" strokeWidth="2" />
          <rect x="115" y="222" width="70" height="6" rx="1" stroke="#1F2937" strokeWidth="1.5" fill="none" />
          <rect x="125" y="218" width="50" height="6" rx="1" stroke="#1F2937" strokeWidth="1.5" fill="none" />
          <path d="M80 70 L85 62 L90 70 L85 78 Z" fill="#1F2937" />
          <circle cx="240" cy="90" r="7" stroke="#1F2937" strokeWidth="1.5" fill="none" />
          <path d="M240 280 L244 280 M242 278 L242 282" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M245 70 L248 75 L252 72" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex w-[52%] items-center justify-center bg-surface">
        <form onSubmit={handleSubmit} className="w-full max-w-[360px] px-8">
          <div className="mb-6">
            <Logo />
          </div>

          <h2 className="mb-1 text-xl font-bold text-text-main">Login</h2>
          <p className="mb-7 text-xs text-text-muted">
            Use your company provided Login credentials
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive-bg px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-main">User ID</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              required
              className="h-10 w-full rounded-lg border border-border bg-white px-3.5 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mb-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-main">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="h-10 w-full rounded-lg border border-border bg-white px-3.5 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mb-6 text-right">
            <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" size="lg" className="w-full">LOGIN</Button>
        </form>
      </div>
    </div>
  );
}
