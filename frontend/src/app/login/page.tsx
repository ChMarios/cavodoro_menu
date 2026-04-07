'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Μετατροπή των αγγλικών μηνυμάτων της Supabase σε πιο φιλικά αν θες
        setErrorMsg(error.message === 'Invalid login credentials' 
          ? 'Λάθος email ή κωδικός πρόσβασης.' 
          : error.message);
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('Παρουσιάστηκε ένα απρόσμενο σφάλμα.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Cavo D'oro</h1>
        <p className={styles.subtitle}>Management Portal</p>
        
        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5a27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <input 
              type="checkbox" 
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2d5a27', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.9rem', color: '#4a4a4a', cursor: 'pointer' }}>
              Remember me
            </label>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </a>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              Don't have an account? {' '}
              <span 
                onClick={() => router.push('/signup')} 
                style={{ color: '#2d5a27', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Sign Up
              </span>
            </p>
          </div>
          
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}