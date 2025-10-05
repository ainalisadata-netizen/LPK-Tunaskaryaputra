// src/app/admin/programs/page.js

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProgramsPage() {
  let user, programs;
  
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

    // Fetch programs data
    const { data: programsData, error: programsError } = await supabase
      .from('programs')
      .select('*')
      .order('name', { ascending: true });

    if (programsError) {
      console.error('Error fetching programs:', programsError);
    } else {
      programs = programsData || [];
    }

  } catch (error) {
    console.error('Error in programs page:', error);
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Program</h1>
      
      {programs && programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{program.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{program.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">
                  {program.duration || 'N/A'}
                </span>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Tidak ada program tersedia.</p>
        </div>
      )}
    </div>
  );
}