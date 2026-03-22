'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../login/login.module.css'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) setError(error.message);
    else setMessage('Check your email for the reset link!');
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Password</h2>
        <form onSubmit={handleReset} className={styles.form}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className={styles.button}>Send Reset Link</button>
          {message && <p style={{color: '#2d5a27', marginTop: '10px'}}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}