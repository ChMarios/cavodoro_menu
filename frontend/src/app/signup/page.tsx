// 'use client';

// import { useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import styles from './signup.module.css';

// export default function SignUpPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [honeypot, setHoneypot] = useState(''); // Bot protection
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const router = useRouter();
    
//     // Honeypot check: If filled, it's a bot
//     if (honeypot !== '') return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     // Validation
//     if (password.length < 6) {
//       setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setMessage({ type: 'error', text: 'Passwords do not match.' });
//       setLoading(false);
//       return;
//     }

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           first_name: firstname,
//           last_name: lastname,
//         },
//         emailRedirectTo: `${window.location.origin}/login`,
//       }
//     });

//     if (error) {
//       setMessage({ type: 'error', text: error.message });
//     } else {
//       setMessage({ 
//         type: 'success', 
//         text: 'Account created! Please check your email for a confirmation link.' 
//       });
//       setTimeout(() => router.push('/login'), 4000);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className={styles.mainWrapper}>
//       <div className={styles.card}>
//         <h1 className={styles.title}>Cavo D'oro</h1>
//         <p className={styles.subtitle}>Administrator Registration</p>
        
//         <form className={styles.form} onSubmit={handleSignUp}>
//           {/* Honeypot Field (Invisible to users) */}
//           <input 
//             type="text" 
//             style={{ display: 'none' }} 
//             tabIndex={-1} 
//             autoComplete="off"
//             onChange={(e) => setHoneypot(e.target.value)}
//           />

//           <div style={{ display: 'flex', gap: '10px' }}>
//             <input
//               type="text"
//               placeholder="First Name"
//               className={styles.input}
//               value={firstname}
//               onChange={(e) => setFirstname(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Last Name"
//               className={styles.input}
//               value={lastname}
//               onChange={(e) => setLastname(e.target.value)}
//               required
//             />
//           </div>

//           <input
//             type="email"
//             placeholder="Email Address"
//             className={styles.input}
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password (min 6 chars)"
//             className={styles.input}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             className={styles.input}
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
          
//           <button type="submit" className={styles.button} disabled={loading}>
//             {loading ? 'Processing...' : 'Register Account'}
//           </button>
          
//           {message.text && (
//             <div className={message.type === 'error' ? styles.error : styles.success} 
//                  style={message.type === 'success' ? {color: '#2d5a27', marginTop: '15px'} : {}}>
//               {message.text}
//             </div>
//           )}
//         </form>
        
//         <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
//           Already have an account? {' '}
//           <span 
//             onClick={() => router.push('/login')} 
//             style={{ color: '#2d5a27', cursor: 'pointer', fontWeight: 'bold' }}
//           >
//             Sign In
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// app/signup/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Μόλις κάποιος φορτώσει τη σελίδα, τον στέλνουμε στο login
    // Έτσι η σελίδα "υπάρχει" στον κώδικα αλλά είναι απροσπέλαστη
    router.replace('/login');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting to Login...</p>
    </div>
  );
}
