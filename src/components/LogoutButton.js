// src/components/LogoutButton.js
"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Arahkan ke halaman utama setelah logout
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
    >
      Logout
    </button>
  );
}