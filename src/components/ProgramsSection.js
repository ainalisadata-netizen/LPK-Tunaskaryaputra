// src/components/ProgramsSection.js

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

async function getPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('id, name, description, image_url')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
  return data;
}

export default async function ProgramsSection() {
  const programs = await getPrograms();

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Program Pelatihan Unggulan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan program berbasis keterampilan dengan metode praktik langsung yang sesuai kebutuhan industri.
          </p>
        </div>

        {programs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={program.image_url}
                    alt={`Gambar untuk program ${program.name}`}
                    fill
                    className="object-cover"
                    // --- TAMBAHKAN PROPERTI 'sizes' DI BAWAH INI ---
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{program.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{program.description}</p>
                  <Link href={`/program/${program.id}`} className="font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Program pelatihan akan segera tersedia.</p>
        )}
      </div>
    </section>
  );
}