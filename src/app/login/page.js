// src/app/login/page.js
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // User is already logged in, redirect based on role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    }
    checkUser()
  }, [supabase, router])

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Langkah 1: Coba login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (signInData.user) {
        // Langkah 2: Jika login berhasil, periksa peran dari tabel 'profiles'
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single();

        if (profileError) {
          throw new Error('Gagal mengambil data profil. Silakan coba lagi.');
        }

        // Langkah 3: Arahkan berdasarkan peran
        if (profile.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
        // Refresh untuk update session
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
        {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}
        <p className="text-center text-sm">
          Belum punya akun? <Link href="/register" className="text-blue-500 hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}