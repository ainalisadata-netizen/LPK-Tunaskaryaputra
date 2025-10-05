// src/app/dashboard/page.js

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function Dashboard() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Jika tidak ada user yang login, alihkan ke halaman login
    redirect('/login');
  }

  // Ambil data profil dari tabel 'profiles'
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold">Selamat Datang di Dasbor Siswa!</h1>
        <p className="text-lg">
          Halo, <span className="font-bold">{profile?.full_name || user.email}</span>!
        </p>
        <p className="text-gray-600">
          Ini adalah halaman pribadi Anda. Fitur-fitur selanjutnya akan ditambahkan di sini.
        </p>
        <div className="pt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}