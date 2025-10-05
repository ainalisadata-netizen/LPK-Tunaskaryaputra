// src/app/register/page.js
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else if (data.user) {
      // Secara default, Supabase akan mengirim email konfirmasi.
      setMessage('Registrasi berhasil! Silakan cek email Anda untuk konfirmasi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Daftar Akun Siswa</h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 block">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
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
          <button type="submit" className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg">
            Daftar
          </button>
        </form>
        {message && <p className="text-center text-sm mt-4">{message}</p>}
        <p className="text-center text-sm">
          Sudah punya akun? <Link href="/login" className="text-blue-500 hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}