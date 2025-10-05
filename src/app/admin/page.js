// src/app/admin/page.js

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  let user, stats;
  
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData) {
      redirect('/login');
    }

    user = userData;

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      redirect('/dashboard');
    }

    // Fetch basic stats (you can customize this based on your needs)
    const { count: graduatesCount } = await supabase
      .from('graduates')
      .select('*', { count: 'exact', head: true });

    const { count: programsCount } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true });

    stats = {
      graduates: graduatesCount || 0,
      programs: programsCount || 0,
    };

  } catch (error) {
    console.error('Error in admin page:', error);
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Lulusan</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.graduates}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Program Pelatihan</h3>
          <p className="text-3xl font-bold text-green-600">{stats.programs}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Admin</h3>
          <p className="text-xl font-bold text-purple-600">Selamat datang!</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Menu Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/graduates" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">📊 Data Lulusan</h3>
            <p className="text-sm text-gray-600">Kelola data alumni dan lulusan</p>
          </a>
          
          <a href="/admin/programs" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">🎓 Program Pelatihan</h3>
            <p className="text-sm text-gray-600">Kelola program dan kursus</p>
          </a>
          
          <a href="/admin/site-content" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">🌐 Konten Website</h3>
            <p className="text-sm text-gray-600">Edit konten halaman website</p>
          </a>
        </div>
      </div>
    </div>
  );
}