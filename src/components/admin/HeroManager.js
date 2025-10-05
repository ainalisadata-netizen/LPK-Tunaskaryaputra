// src/components/admin/HeroManager.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function HeroManager() {
  const supabase = createClient();
  const [slides, setSlides] = useState([]);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchSlides = useCallback(async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('hero_sliders')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      setMessage({ text: 'Gagal memuat slides', type: 'error' });
    } finally {
      setFetchLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const validateForm = () => {
    if (!heading.trim()) {
      setMessage({ text: 'Heading harus diisi', type: 'error' });
      return false;
    }
    if (!subheading.trim()) {
      setMessage({ text: 'Subheading harus diisi', type: 'error' });
      return false;
    }
    if (!imageUrl.trim()) {
      setMessage({ text: 'Image URL harus diisi', type: 'error' });
      return false;
    }
    if (order < 0) {
      setMessage({ text: 'Order tidak boleh negatif', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) return;

    setLoading(true);

    try {
      let error;
      if (editingId) {
        // Mode Update
        ({ error } = await supabase
          .from('hero_sliders')
          .update({ 
            heading: heading.trim(), 
            subheading: subheading.trim(), 
            image_url: imageUrl.trim(), 
            order,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId));
      } else {
        // Mode Insert
        ({ error } = await supabase
          .from('hero_sliders')
          .insert([{ 
            heading: heading.trim(), 
            subheading: subheading.trim(), 
            image_url: imageUrl.trim(), 
            order 
          }]));
      }

      if (error) throw error;

      setMessage({ 
        text: editingId ? 'Slide berhasil diperbarui!' : 'Slide berhasil ditambahkan!', 
        type: 'success' 
      });
      resetForm();
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus slide ini?')) return;

    try {
      const { error } = await supabase
        .from('hero_sliders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ text: 'Slide berhasil dihapus!', type: 'success' });
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setHeading(slide.heading);
    setSubheading(slide.subheading);
    setImageUrl(slide.image_url);
    setOrder(slide.order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setHeading('');
    setSubheading('');
    setImageUrl('');
    setOrder(0);
    setMessage({ text: '', type: '' });
  };

  const getNextOrder = () => {
    if (slides.length === 0) return 0;
    return Math.max(...slides.map(slide => slide.order)) + 1;
  };

  useEffect(() => {
    if (!editingId) {
      setOrder(getNextOrder());
    }
  }, [slides, editingId]);

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">
            {editingId ? '✏️ Edit Slide' : '➕ Tambah Slide Baru'}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {editingId ? 'Perbarui konten slide hero' : 'Tambahkan slide baru untuk hero section'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Heading *
                </label>
                <input
                  type="text"
                  placeholder="Judul utama slide"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subheading *
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi atau subjudul"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order *
                </label>
                <input
                  type="number"
                  placeholder="Urutan tampilan"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  min="0"
                  required
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Angka lebih kecil akan ditampilkan lebih dulu</p>
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
                  src={imageUrl}
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
                  {message.text}
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
                    : editingId ? 'Perbarui Slide' : 'Tambah Slide'
                  }
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Slides List Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">📋 Daftar Slide</h3>
          <p className="text-gray-400 text-sm mt-1">
            Kelola semua slide hero yang aktif
          </p>
        </div>
        
        <div className="p-6">
          {fetchLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg">Belum ada slide</p>
              <p className="text-sm">Tambahkan slide pertama Anda di atas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex flex-col lg:flex-row justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex-1 flex flex-col lg:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-12 bg-gray-600 rounded overflow-hidden">
                        <img
                          src={slide.image_url}
                          alt={slide.heading}
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-bold text-white truncate">
                          {slide.heading}
                        </h4>
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full font-medium">
                          Order: {slide.order}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                        {slide.subheading}
                      </p>
                      <p className="text-gray-400 text-xs truncate max-w-2xl">
                        {slide.image_url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 self-end lg:self-center">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-sm rounded-lg text-black font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
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