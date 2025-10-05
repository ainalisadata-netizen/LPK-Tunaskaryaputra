// src/app/admin/site-content/page.js

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SiteContentPage() {
  let user, siteContent;
  
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

    // Fetch site content data
    const { data: contentData, error: contentError } = await supabase
      .from('site_content')
      .select('*')
      .order('content_key', { ascending: true });

    if (contentError) {
      console.error('Error fetching site content:', contentError);
    } else {
      siteContent = contentData || [];
    }

  } catch (error) {
    console.error('Error in site content page:', error);
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kelola Konten Website</h1>
      
      {siteContent && siteContent.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {siteContent.map((content) => (
                <tr key={content.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {content.content_key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Tidak ada konten website.</p>
        </div>
      )}
    </div>
  );
}