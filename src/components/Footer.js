// src/components/Footer.js

import Link from 'next/link';

// PASTIKAN ADA 'export default' DI SINI
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">LPK Tunas Karya Putra</h3>
            <p className="text-gray-400 max-w-sm mt-2">
              Mencetak Generasi Terampil, Mandiri, dan Berdaya Saing.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Kontak Kami</h4>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Jl. Taruna Raya No.6B, RT.01/RW.02, Ujung Berung, Kota Bandung, Jawa Barat 40619</p>
              <p><strong>Telepon/WA:</strong> <a href="tel:082115315155" className="hover:text-blue-400">082115315155</a></p>
              <p><strong>Email:</strong> <a href="mailto:tunaskaryaputrabandung@gmail.com" className="hover:text-blue-400">tunaskaryaputrabandung@gmail.com</a></p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} LPK Tunas Karya Putra. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}