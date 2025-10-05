// src/app/dashboard/page.js

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function Dashboard() {
  let user, profile;
  
  try {
    const supabase = createClient();

    // Get user session
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      redirect('/login');
    }

    user = userData;

    if (!user) {
      redirect('/login');
    }

    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Jangan redirect, biarkan profile null dan tampilkan fallback
    } else {
      profile = profileData;
    }

  } catch (error) {
    console.error('Unexpected error in dashboard:', error);
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {profile?.role === 'admin' ? 'Dashboard Admin' : 'Selamat Datang di Dasbor Siswa!'}
        </h1>
        
        <div className="py-4">
          <p className="text-lg text-gray-700">
            Halo, <span className="font-bold text-blue-600">
              {profile?.full_name || user?.email || 'Pengguna'}
            </span>!
          </p>
          {profile?.role && (
            <p className="text-sm text-gray-500 mt-2">
              Role: <span className="font-medium capitalize">{profile.role}</span>
            </p>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">
          Ini adalah halaman pribadi Anda. Fitur-fitur selanjutnya akan ditambahkan di sini.
        </p>

        {/* Info tambahan untuk user */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-blue-800 mb-2">Fitur yang Akan Datang:</h3>
          <ul className="text-sm text-blue-700 text-left space-y-1">
            <li>• Lihat progress belajar</li>
            <li>• Akses materi pelatihan</li>
            <li>• Informasi sertifikat</li>
            <li>• Jadwal pelatihan</li>
          </ul>
        </div>

        <div className="pt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}