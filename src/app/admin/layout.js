// src/app/admin/layout.js
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default async function AdminLayout({ children }) {
  let supabase;
  let user = null;
  
  try {
    supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData?.user;

    if (!user) redirect('/login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') redirect('/login');

  } catch (error) {
    console.error('Admin layout error:', error);
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Selamat Datang di Admin Panel
                </h1>
                <p className="text-cyan-200">
                  Halo, {user?.email} 👋 - Kelola konten situs dengan mudah
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300 font-medium">Online</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-700/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Admin CMS. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">v1.0.0</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm font-medium">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}