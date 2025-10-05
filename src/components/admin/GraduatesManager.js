// src/components/admin/GraduatesManager.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GraduatesManager() {
  const supabase = createClient();
  const [graduates, setGraduates] = useState([]);
  const [email, setEmail] = useState('');
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [program, setProgram] = useState('');
  const [tglPelatihan, setTglPelatihan] = useState('');
  const [status, setStatus] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Untuk opsi dropdown status
  const statusOptions = ['Lulus', 'Tidak Lulus', 'Sedang Berjalan'];

  const fetchGraduates = useCallback(async () => {
    try {
      setFetchLoading(true);
      // Menggunakan tabel graduates yang benar
      const { data, error } = await supabase
        .from('graduates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGraduates(data || []);
    } catch (error) {
      console.error('Error fetching graduates:', error);
      setMessage({ text: 'Gagal memuat data lulusan', type: 'error' });
    } finally {
      setFetchLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchGraduates();
  }, [fetchGraduates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      let error;
      const graduateData = {
        email: email.trim(),
        nama: nama.trim(),
        nik: nik.trim() || null,
        alamat: alamat.trim() || null,
        program: program.trim() || null,
        tgl_pelatihan: tglPelatihan || null,
        status: status || null,
        whatsapp: whatsapp.trim() || null,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        // Update data graduate
        ({ error } = await supabase
          .from('graduates')
          .update(graduateData)
          .eq('id', editingId));
      } else {
        // Insert data graduate baru
        ({ error } = await supabase
          .from('graduates')
          .insert([graduateData]));
      }

      if (error) throw error;

      setMessage({ 
        text: editingId ? 'Data lulusan berhasil diperbarui!' : 'Data lulusan berhasil ditambahkan!', 
        type: 'success' 
      });
      resetForm();
      fetchGraduates();
    } catch (error) {
      console.error('Error saving graduate:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data lulusan ini?')) return;

    try {
      const { error } = await supabase
        .from('graduates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ text: 'Data lulusan berhasil dihapus!', type: 'success' });
      fetchGraduates();
    } catch (error) {
      console.error('Error deleting graduate:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    }
  };

  const handleEdit = (graduate) => {
    setEditingId(graduate.id);
    setEmail(graduate.email || '');
    setNama(graduate.nama || '');
    setNik(graduate.nik || '');
    setAlamat(graduate.alamat || '');
    setProgram(graduate.program || '');
    setTglPelatihan(graduate.tgl_pelatihan || '');
    setStatus(graduate.status || '');
    setWhatsapp(graduate.whatsapp || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setEmail('');
    setNama('');
    setNik('');
    setAlamat('');
    setProgram('');
    setTglPelatihan('');
    setStatus('');
    setWhatsapp('');
    setMessage({ text: '', type: '' });
  };

  // Fungsi untuk menampilkan pesan dengan aman
  const renderMessage = () => {
    if (!message.text) return null;
    
    return (
      <div className={`px-4 py-3 rounded-lg ${
        message.type === 'error' 
          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
          : 'bg-green-500/20 text-green-300 border border-green-500/30'
      }`}>
        {message.text}
      </div>
    );
  };

  // Format tanggal untuk display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">
            {editingId ? '✏️ Edit Data Lulusan' : '➕ Tambah Data Lulusan Baru'}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {editingId ? 'Perbarui data lulusan' : 'Tambahkan data lulusan baru'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="Email lulusan"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap lulusan"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  NIK
                </label>
                <input
                  type="text"
                  placeholder="Nomor Induk Kependudukan"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alamat
                </label>
                <textarea
                  placeholder="Alamat lengkap"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Program
                </label>
                <input
                  type="text"
                  placeholder="Program pelatihan"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tanggal Pelatihan
                </label>
                <input
                  type="date"
                  value={tglPelatihan}
                  onChange={(e) => setTglPelatihan(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                >
                  <option value="">Pilih Status</option>
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Nomor WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Message & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-700">
            <div className="flex-1">
              {renderMessage()}
            </div>
            
            <div className="flex gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>
                  {loading 
                    ? 'Menyimpan...' 
                    : editingId ? 'Perbarui Data' : 'Tambah Data'
                  }
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Graduates List Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">📋 Daftar Lulusan</h3>
          <p className="text-gray-400 text-sm mt-1">
            Kelola semua data lulusan
          </p>
        </div>
        
        <div className="p-6">
          {fetchLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : graduates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg">Belum ada data lulusan</p>
              <p className="text-sm">Tambahkan data lulusan pertama Anda di atas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Nama</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Program</th>
                    <th scope="col" className="px-6 py-3">Tanggal Pelatihan</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">WhatsApp</th>
                    <th scope="col" className="px-6 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {graduates.map((graduate) => (
                    <tr key={graduate.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700">
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
                        {graduate.nama || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {graduate.email || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {graduate.program || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(graduate.tgl_pelatihan)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          graduate.status === 'Lulus' ? 'bg-green-500/20 text-green-300' :
                          graduate.status === 'Tidak Lulus' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {graduate.status || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {graduate.whatsapp || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(graduate)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-xs rounded text-black font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(graduate.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-400 text-xs rounded text-white font-medium transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}