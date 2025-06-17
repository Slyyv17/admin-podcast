'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import DotsLoader from '@/components/ui/loader';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  podcastId: string;
}

export default function NewEpisodeModal({ onClose, podcastId }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audio: null as File | null,
  });

  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file' && e.target.files?.[0]) {
      const file = e.target.files[0];
      if (name === 'audio') {
        setFormData(prev => ({ ...prev, audio: file }));
        setAudioPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!formData.title || !formData.description || !formData.audio) {
      return setMessage('Please fill in all required fields.');
    }

    const token = localStorage.getItem('token');
    if (!token) return setMessage('You must be logged in.');

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('audio', formData.audio as File);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/podcasts/${podcastId}/new-episodes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message ?? 'Upload failed');
      }

      setMessage(res.message ?? 'Episode uploaded!');
      setFormData({ title: '', description: '', audio: null });
      setAudioPreview(null);
    } catch (error) {
      console.error(error);
      setMessage((error as Error).message ?? 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70
            backdrop-blur-sm bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-black/50 text-[var(--txt-clr)] rounded-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-[var] text-xl cursor-pointer">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-red-500 text-center">🎧 Upload New Episode</h2>

        {message && (
          <p
            className={`text-sm text-center mb-4 ${
              message.toLowerCase().includes('fail') || message.toLowerCase().includes('error')
                ? 'text-red-400'
                : 'text-green-400'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Episode Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-black/50 focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Episode Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-black/50 resize-none h-32 focus:outline-none"
          />
          <input
            type="file"
            name="audio"
            accept="audio/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-300"
          />
          {audioPreview && (
            <div>
              <p className="text-sm mt-2 mb-1 text-gray-300">Audio Preview:</p>
              <audio controls src={audioPreview} className="w-full" />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-[var(--acc-clr)] cursor-pointer hover:bg-red-900 text-[var(--txt-clr)] font-semibold py-3 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? <DotsLoader /> : 'Upload Episode'}
          </button>
        </form>
      </div>
    </div>
  );
}
