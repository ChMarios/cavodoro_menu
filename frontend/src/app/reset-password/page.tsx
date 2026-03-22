'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Προσθήκη επιβεβαίωσης
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
    } else {
      alert('Password updated successfully! You can now log in.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>New Password</h2>
        <form onSubmit={handleUpdate} className={styles.form}>
          <input 
            type="password" 
            placeholder="Enter new password" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
          <input 
            type="password" 
            placeholder="Confirm new password" 
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}