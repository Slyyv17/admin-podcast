'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import DotsLoader from '@/components/ui/loader';

const UploadPodcast: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImg: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'coverImg' && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, coverImg: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const insertMarkdown = (syntax: 'bold' | 'italic' | 'list') => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.description;
    let newText = '';

    switch (syntax) {
      case 'bold':
        newText = `${value.slice(0, start)}**${value.slice(start, end)}**${value.slice(end)}`;
        break;
      case 'italic':
        newText = `${value.slice(0, start)}*${value.slice(start, end)}*${value.slice(end)}`;
        break;
      case 'list':
        const listItems = value
          .slice(start, end)
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        newText = `${value.slice(0, start)}${listItems}${value.slice(end)}`;
        break;
    }

    setFormData({ ...formData, description: newText });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.description || !formData.coverImg) {
      setIsLoading(false);
      return setMessage('All fields are required.');
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('coverImg', formData.coverImg);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/podcast/new-podcast`,
        data
      );
      setMessage(res.data.message ?? 'Podcast uploaded!');
      setFormData({ title: '', description: '', coverImg: null });
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      setMessage('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg-clr)] px-4 py-10 overflow-auto pry-ff">
      <div className="bg-[var(--bg-clr)]/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-[var(--txt-clr)]">
        <h2 className="text-2xl font-bold mb-6 text-center">🎙 Upload a Podcast</h2>

        {message && <p className="mb-4 text-sm text-red-500 text-center">{message}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Podcast Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]"
          />

<div className="flex gap-2">
            {['bold', 'italic', 'list'].map(syntax => (
              <button
                key={syntax}
                type="button"
                onClick={() => insertMarkdown(syntax as any)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
              >
                {syntax[0].toUpperCase() + syntax.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            id="description"
            name="description"
            placeholder="Write podcast description..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 h-32 resize-none bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]"
          />

          <input
            type="file"
            name="coverImg"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--acc-clr)] file:text-white hover:file:bg-opacity-90"
          />

          {previewUrl && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg border border-gray-300 bg-transparent"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--acc-clr)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            {isLoading ? <DotsLoader /> : 'Upload Podcast'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPodcast;