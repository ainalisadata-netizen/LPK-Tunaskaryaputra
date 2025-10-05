// src/app/admin/graduates/page.js

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GraduatesPage() {
  let user, graduates;
  
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

    // Fetch graduates data
    const { data: graduatesData, error: graduatesError } = await supabase
      .from('graduates')
      .select('*')
      .order('created_at', { ascending: false });

    if (graduatesError) {
      console.error('Error fetching graduates:', graduatesError);
    } else {
      graduates = graduatesData || [];
    }

  } catch (error) {
    console.error('Error in graduates page:', error);
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Data Lulusan</h1>
      
      {graduates && graduates.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Lulus
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {graduates.map((graduate) => (
                <tr key={graduate.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {graduate.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {graduate.program_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(graduate.graduation_date).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Tidak ada data lulusan.</p>
        </div>
      )}
    </div>
  );
}