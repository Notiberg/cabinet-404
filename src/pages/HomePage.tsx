import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentListIcon, 
  BeakerIcon, 
  DocumentCheckIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, metalTracking, workClosures, documentTracking } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate statistics
  const activeTasks = tasks.filter(task => task.status === 'working').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
  
  const activeMetals = metalTracking.filter(metal => metal.status === 'working').length;
  const activeWorks = workClosures.filter(work => work.status === 'working').length;
  const activeDocs = documentTracking.filter(doc => doc.status === 'working').length;
  
  const totalActive = activeTasks + activeMetals + activeWorks + activeDocs;
  const totalCompleted = completedTasks + 
    metalTracking.filter(metal => metal.status === 'completed').length +
    workClosures.filter(work => work.status === 'completed').length +
    documentTracking.filter(doc => doc.status === 'completed').length;
  const totalOverdue = overdueTasks +
    metalTracking.filter(metal => metal.status === 'overdue').length +
    workClosures.filter(work => work.status === 'overdue').length;

  const sections = [
    {
      id: 'tasks',
      title: 'Задачи',
      description: 'Управление задачами и назначениями',
      icon: ClipboardDocumentListIcon,
      path: '/tasks',
      gradient: 'from-blue-400 to-purple-500',
    },
    {
      id: 'metal-tracking',
      title: 'Отслеживание металла',
      description: 'Контроль испытаний материалов',
      icon: BeakerIcon,
      path: '/metal-tracking',
      gradient: 'from-green-400 to-blue-500',
    },
    {
      id: 'work-closure',
      title: 'Закрытия',
      description: 'Завершение рабочих процессов',
      icon: DocumentCheckIcon,
      path: '/work-closure',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'calendar',
      title: 'Календарь',
      description: 'Планирование и контроль сроков',
      icon: CalendarDaysIcon,
      path: '/calendar',
      gradient: 'from-purple-400 to-pink-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen p-4 pt-16 pb-24">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Кабинет 404
          </h1>
          <p className="text-white/70">
            Система управления рабочими процессами
          </p>
        </motion.div>

        {/* Main Sections Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {sections.map((section) => {
            const IconComponent = section.icon;
            
            return (
              <motion.div
                key={section.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-6 cursor-pointer group"
                onClick={() => navigate(section.path)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.gradient} shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect indicator */}
                <div className="mt-4 flex justify-end">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <svg 
                      className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="mt-8 glass-card p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Быстрая статистика
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{activeTasks}</div>
              <div className="text-sm text-white/70">Активных задач</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{totalCompleted}</div>
              <div className="text-sm text-white/70">Завершено</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">{totalActive}</div>
              <div className="text-sm text-white/70">В работе</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">{totalOverdue}</div>
              <div className="text-sm text-white/70">Просрочено</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
