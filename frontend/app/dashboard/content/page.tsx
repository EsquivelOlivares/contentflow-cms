'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from '@/components/ConfirmModal';

interface Content {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  publishedAt: string | null;
}

export default function ContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string, title: string) => {
    setSelectedItem({ id, title });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleting(selectedItem.id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/content/${selectedItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setContents(contents.filter(c => c.id !== selectedItem.id));
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error al eliminar el contenido');
    } finally {
      setDeleting(null);
      setSelectedItem(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      published: 'Publicado',
      draft: 'Borrador',
      archived: 'Archivado',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contenido</h1>
          <p className="text-gray-600 mt-2">
            Gestiona todos los artículos y páginas de tu sitio
          </p>
        </div>
        <Link
          href="/dashboard/content/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo artículo
        </Link>
      </div>

      {contents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No hay contenido aún</p>
          <Link
            href="/dashboard/content/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Crear tu primer artículo →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {content.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      /{content.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(content.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/dashboard/content/${content.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(content.id, content.title)}
                        disabled={deleting === content.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar artículo"
        message={`¿Estás seguro de que quieres eliminar "${selectedItem?.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
