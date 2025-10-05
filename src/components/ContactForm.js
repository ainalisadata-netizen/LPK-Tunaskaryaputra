// src/components/ContactForm.js
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // ✅ Import yang benar

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createClient(); // ✅ Gunakan client yang konsisten

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Your form submission logic here
      const { error } = await supabase
        .from('contacts')
        .insert([formData]);

      if (error) throw error;
      
      setMessage('Pesan berhasil dikirim!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}