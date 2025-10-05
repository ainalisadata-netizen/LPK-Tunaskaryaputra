// src/components/admin/ProgramsManager.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProgramsManager() {
  const supabase = createClient();
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setMessage({ text: 'Gagal memuat program', type: 'error' });
    } finally {
      setFetchLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      let curriculumData = null;
      // Parse curriculum jika ada isinya
      if (curriculum.trim()) {
        try {
          curriculumData = JSON.parse(curriculum.trim());
        } catch (parseError) {
          throw new Error('Format JSON kurikulum tidak valid');
        }
      }

      let error;
      if (editingId) {
        // Update
        ({ error } = await supabase
          .from('programs')
          .update({ 
            name: name.trim(), 
            description: description.trim(), 
            curriculum: curriculumData,
            image_url: imageUrl.trim()
          })
          .eq('id', editingId));
      } else {
        // Insert
        ({ error } = await supabase
          .from('programs')
          .insert([{ 
            name: name.trim(), 
            description: description.trim(), 
            curriculum: curriculumData,
            image_url: imageUrl.trim()
          }]));
      }

      if (error) throw error;

      setMessage({ 
        text: editingId ? 'Program berhasil diperbarui!' : 'Program berhasil ditambahkan!', 
        type: 'success' 
      });
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus program ini?')) return;

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ text: 'Program berhasil dihapus!', type: 'success' });
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setName(program.name);
    setDescription(program.description || '');
    
    // Handle curriculum data - bisa string atau object
    if (program.curriculum) {
      if (typeof program.curriculum === 'string') {
        setCurriculum(program.curriculum);
      } else {
        // Jika object, convert ke string JSON
        setCurriculum(JSON.stringify(program.curriculum, null, 2));
      }
    } else {
      setCurriculum('');
    }
    
    setImageUrl(program.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCurriculum('');
    setImageUrl('');
    setMessage({ text: '', type: '' });
  };

  // Fungsi untuk merender field dengan aman
  const renderSafe = (data) => {
    if (data === null || data === undefined) return '-';
    if (typeof data === 'string') return data;
    if (typeof data === 'number') return data.toString();
    if (typeof data === 'boolean') return data.toString();
    
    // Jika object/array, convert ke string JSON
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return 'Data tidak dapat ditampilkan';
    }
  };

  // Fungsi untuk menampilkan curriculum dengan format yang benar
  const renderCurriculum = (curriculumData) => {
    if (!curriculumData) return 'Tidak ada kurikulum';
    
    try {
      const parsed = typeof curriculumData === 'string' 
        ? JSON.parse(curriculumData) 
        : curriculumData;
      
      return JSON.stringify(parsed, null, 2);
    } catch {
      return renderSafe(curriculumData);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">
            {editingId ? '✏️ Edit Program' : '➕ Tambah Program Baru'}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {editingId ? 'Perbarui detail program' : 'Tambahkan program pelatihan baru'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Program *
                </label>
                <input
                  type="text"
                  placeholder="Nama program pelatihan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Deskripsi program"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kurikulum (JSON)
                </label>
                <textarea
                  placeholder='Contoh: {"materi": ["HTML", "CSS", "JavaScript"], "durasi": "3 bulan"}'
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Masukkan data dalam format JSON yang valid
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Gambar
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="p-4 bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preview Gambar:
              </label>
              <div className="relative aspect-video max-w-2xl bg-gray-600 rounded-lg overflow-hidden">
                <img
                  src={renderSafe(imageUrl)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center text-gray-400">
                  ❌ Gambar tidak dapat dimuat
                </div>
              </div>
            </div>
          )}

          {/* Message & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-700">
            <div className="flex-1">
              {message.text && (
                <div className={`px-4 py-3 rounded-lg ${
                  message.type === 'error' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {renderSafe(message.text)}
                </div>
              )}
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
                    : editingId ? 'Perbarui Program' : 'Tambah Program'
                  }
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Programs List Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">📋 Daftar Program</h3>
          <p className="text-gray-400 text-sm mt-1">
            Kelola semua program pelatihan
          </p>
        </div>
        
        <div className="p-6">
          {fetchLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-lg">Belum ada program</p>
              <p className="text-sm">Tambahkan program pertama Anda di atas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="flex flex-col lg:flex-row justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex-1 flex flex-col lg:flex-row gap-4">
                    {program.image_url && (
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-600 rounded overflow-hidden">
                          <img
                            src={renderSafe(program.image_url)}
                            alt={renderSafe(program.name)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs bg-gray-500">
                            ❌
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-lg mb-2">
                        {renderSafe(program.name)}
                      </h4>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                        {renderSafe(program.description)}
                      </p>
                      {program.curriculum && (
                        <div className="mt-2">
                          <details className="text-gray-400 text-sm">
                            <summary className="cursor-pointer hover:text-gray-300">
                              Lihat Kurikulum
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-600 rounded text-xs whitespace-pre-wrap overflow-auto max-h-60">
                              {renderCurriculum(program.curriculum)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 self-end lg:self-center">
                    <button
                      onClick={() => handleEdit(program)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-sm rounded-lg text-black font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-400 text-sm rounded-lg text-white font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>🗑️</span>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}