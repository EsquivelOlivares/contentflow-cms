'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Archive,
  Pencil,
  Trash,
  Star,
  Eye
} from 'react-bootstrap-icons';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Content {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Activity {
  id: string;
  action: string;
  entityTitle: string;
  userName: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }

        const token = localStorage.getItem('token');
        
        const contentResponse = await axios.get('http://localhost:3000/api/content', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(contentResponse.data.data || []);

        const activityResponse = await axios.get('http://localhost:3000/api/activity/recent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(activityResponse.data.data || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Artículos',
      value: content.length,
      icon: FileText,
      gradient: 'from-blue-600 to-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    {
      title: 'Publicados',
      value: content.filter(c => c.status === 'published').length,
      icon: CheckCircle,
      gradient: 'from-emerald-600 to-emerald-400',
      iconBg: 'bg-emerald-500/20'
    },
    {
      title: 'Borradores',
      value: content.filter(c => c.status === 'draft').length,
      icon: Clock,
      gradient: 'from-amber-600 to-amber-400',
      iconBg: 'bg-amber-500/20'
    },
    {
      title: 'Archivados',
      value: content.filter(c => c.status === 'archived').length,
      icon: Archive,
      gradient: 'from-slate-600 to-slate-400',
      iconBg: 'bg-slate-500/20'
    },
  ];

  const getActivityIcon = (action: string) => {
    const icons = {
      created: { icon: Star, color: 'bg-blue-100 text-blue-600' },
      updated: { icon: Pencil, color: 'bg-amber-100 text-amber-600' },
      published: { icon: Eye, color: 'bg-emerald-100 text-emerald-600' },
      deleted: { icon: Trash, color: 'bg-red-100 text-red-600' },
    };
    return icons[action as keyof typeof icons] || { icon: Pencil, color: 'bg-gray-100 text-gray-600' };
  };

  const getActionText = (action: string, title: string) => {
    const texts = {
      created: `creó "${title}"`,
      updated: `actualizó "${title}"`,
      published: `publicó "${title}"`,
      deleted: `eliminó "${title}"`,
    };
    return texts[action as keyof typeof texts] || `modificó "${title}"`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-emerald-100 text-emerald-700',
      draft: 'bg-amber-100 text-amber-700',
      archived: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      published: 'Publicado',
      draft: 'Borrador',
      archived: 'Archivado',
    };
    return (
      <span className={`px-3 py-1 text-xs rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tu contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          ¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {user?.role === 'admin' ? 'Administrador' : 'Editor'} · {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <Row className="g-4 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Col key={index} md={6} xl={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-gradient-to-r ${stat.gradient} rounded-2xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-xl backdrop-blur-sm`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-1">{stat.value}</h3>
                <p className="text-white/80 text-sm">{stat.title}</p>
              </motion.div>
            </Col>
          );
        })}
      </Row>

      {/* Contenido Principal */}
      <Row className="g-4">
        {/* Actividad Reciente */}
        <Col lg={5}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
              ) : (
                activities.map((activity, index) => {
                  const { icon: IconComponent, color } = getActivityIcon(activity.action);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${color}`}>
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">{activity.userName || 'Usuario'}</span>{' '}
                          {getActionText(activity.action, activity.entityTitle)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.createdAt).toLocaleDateString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </Col>

        {/* Contenido Reciente */}
        <Col lg={7}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                Últimos Artículos
              </h3>
              <motion.a 
                href="/dashboard/content"
                whileHover={{ x: 5 }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Ver todos
                <span className="text-lg">→</span>
              </motion.a>
            </div>

            {content.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={32} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay artículos aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {content.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.status === 'published' ? 'bg-emerald-100' : 
                        item.status === 'draft' ? 'bg-amber-100' : 'bg-gray-100'
                      }`}>
                        {item.status === 'published' ? <CheckCircle className="text-emerald-600" size={18} /> :
                         item.status === 'draft' ? <Clock className="text-amber-600" size={18} /> :
                         <Archive className="text-gray-600" size={18} />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
