'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Content {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  metadata: {
    description?: string;
    keywords?: string[];
  };
}

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Content>({
    id: '',
    title: '',
    body: '',
    status: 'draft',
    metadata: {
      description: '',
      keywords: [],
    },
  });
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Cambiado: ahora con /api/
      const response = await axios.get(`http://localhost:3000/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Error al cargar el contenido');
      router.push('/dashboard/content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'description') {
      setFormData({
        ...formData,
        metadata: { 
          ...formData.metadata, 
          description: value 
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.metadata.keywords?.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          keywords: [...(formData.metadata.keywords || []), keywordInput.trim()],
        },
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        keywords: formData.metadata.keywords?.filter(k => k !== keyword) || [],
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const updateData = {
        title: formData.title,
        body: formData.body,
        status: formData.status,
        metadata: {
          description: formData.metadata.description,
          keywords: formData.metadata.keywords || [],
        },
        updatedById: user?.id,
      };

      // Cambiado: ahora con /api/
      await axios.patch(`http://localhost:3000/api/content/${id}`, updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      router.push('/dashboard/content');
    } catch (error: any) {
      console.error('Error updating content:', error);
      alert(error.response?.data?.error || 'Error al actualizar el contenido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/content"
          className="text-gray-600 hover:text-gray-900 flex items-center mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Volver al listado
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar contenido</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contenido */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={10}
              value={formData.body}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          {/* Meta descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Meta descripción (para SEO)
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.metadata.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palabras clave (keywords)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Agregar keyword"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Agregar
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.metadata.keywords?.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link
              href="/dashboard/content"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
