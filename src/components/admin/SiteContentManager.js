// src/components/admin/SiteContentManager.js
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function SiteContentManager() {
  const supabase = createClient();
  const [contentItems, setContentItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [currentContent, setCurrentContent] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchContent = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('content_key');

      if (error) throw error;
      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage({ text: 'Gagal memuat konten', type: 'error' });
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleOpenModal = (item) => {
    setEditingItem(item);
    setCurrentContent(item.content_body || '');
    setMessage({ text: '', type: '' });
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setCurrentContent('');
    setMessage({ text: '', type: '' });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase
        .from('site_content')
        .update({ 
          content_body: currentContent,
          updated_at: new Date().toISOString()
        })
        .eq('content_key', editingItem.content_key);

      if (error) throw error;

      setMessage({ text: 'Konten berhasil diperbarui!', type: 'success' });
      await fetchContent();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getContentPreview = (content) => {
    if (!content) return 'Tidak ada konten';
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return cleanContent.length > 100 
      ? cleanContent.substring(0, 100) + '...' 
      : cleanContent;
  };

  return (
    <div className="space-y-8">
      {/* Content List */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">📝 Manajemen Konten Situs</h3>
          <p className="text-gray-400 text-sm mt-1">
            Kelola semua konten teks yang ditampilkan di situs
          </p>
        </div>
        
        <div className="p-6">
          {fetchLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : contentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg">Tidak ada konten</p>
              <p className="text-sm">Konten akan muncul setelah diatur di database</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contentItems.map((item) => (
                <motion.div
                  key={item.content_key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-bold text-white text-lg">
                          {item.title}
                        </h4>
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full font-mono">
                          {item.content_key}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="p-3 bg-gray-600 rounded border border-gray-500">
                        <p className="text-gray-200 text-sm whitespace-pre-wrap">
                          {getContentPreview(item.content_body)}
                        </p>
                      </div>
                      {item.updated_at && (
                        <p className="text-gray-400 text-xs mt-2">
                          Terakhir diperbarui: {new Date(item.updated_at).toLocaleDateString('id-ID')}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-black font-medium transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      ✏️ Edit: {editingItem.title}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {editingItem.description}
                    </p>
                    <p className="text-gray-500 text-xs font-mono mt-1">
                      Key: {editingItem.content_key}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <span className="text-2xl text-gray-400">×</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-6 flex-1 overflow-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Konten:
                      </label>
                      <textarea
                        value={currentContent}
                        onChange={(e) => setCurrentContent(e.target.value)}
                        rows={12}
                        placeholder="Ketik konten Anda di sini..."
                        className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors font-mono text-sm resize-none"
                      />
                    </div>
                    
                    {/* Character Count */}
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>
                        {currentContent.length} karakter
                      </span>
                      <span>
                        {Math.ceil(currentContent.length / 2000)} halaman
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-700 bg-gray-750 flex-shrink-0">
                  <div className="flex justify-between items-center">
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
                      <button
                        onClick={handleCloseModal}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors flex items-center space-x-2"
                      >
                        {loading && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>
                          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}