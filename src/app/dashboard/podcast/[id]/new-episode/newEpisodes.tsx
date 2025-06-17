'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import DotsLoader from '@/components/ui/loader';

export default function NewEpisodeComponent() {
  const pathname = usePathname();
  const podcastId = pathname?.split('/')[2]; // e.g. /podcast/[id]/new-episode

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audio: null as File | null,
  });

  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverImg, setCoverImg] = useState<string | null>(null); // Inherited coverImg

  useEffect(() => {
    if (!podcastId) return;

    async function fetchPodcast() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setMessage('You must be logged in.');

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/podcast/${podcastId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCoverImg(response.data.podcast.coverImg);
      } catch (error) {
        console.error(error);
        setMessage('Failed to fetch podcast cover.');
      }
    }

    fetchPodcast();
  }, [podcastId]);

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

    if (!formData.title || !formData.description || !formData.audio || !coverImg) {
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
      data.append('coverImg', coverImg); // Inherit cover image as string (URL)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/episode/${podcastId}/new-episode`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message ?? 'Episode uploaded!');
      setFormData({ title: '', description: '', audio: null });
      setAudioPreview(null);
    } catch (error) {
      console.error(error);
      setMessage('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-black text-white px-4 py-10 pry-ff">
      <div className="bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">🎧 Upload New Episode</h2>

        {message && <p className="mb-4 text-sm text-center text-green-400">{message}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Episode Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-gray-700 focus:outline-none"
          />

          <textarea
            name="description"
            placeholder="Episode Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border bg-gray-700 resize-none h-32 focus:outline-none"
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
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg"
          >
            {isLoading ? <DotsLoader /> : 'Upload Episode'}
          </button>
        </form>
      </div>
    </div>
  );
}
