// src/app/admin/layout.js

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({ children }) {
  let user;
  
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

  } catch (error) {
    console.error('Error in admin layout:', error);
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-600">LPK Tunas Karya Putra</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <Link 
              href="/admin" 
              className="py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/graduates" 
              className="py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition-colors"
            >
              Data Lulusan
            </Link>
            <Link 
              href="/admin/programs" 
              className="py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition-colors"
            >
              Program
            </Link>
            <Link 
              href="/admin/site-content" 
              className="py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition-colors"
            >
              Konten Website
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}