// src/app/admin/graduates/page.js
import GraduatesManager from '@/components/admin/GraduatesManager';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GraduatesPage() {
  let supabase;
  
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      redirect('/login');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      redirect('/login');
    }

  } catch (error) {
    console.error('Graduates page error:', error);
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              📊 Data Lulusan
            </h2>
            <p className="text-gray-400">
              Kelola data lulusan pelatihan
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <GraduatesManager />
      </div>
    </div>
  );
}
