import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SimpleHomePage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'tasks',
      title: 'Задачи',
      description: 'Управление задачами и назначениями',
      path: '/tasks',
      color: '#4F46E5',
    },
    {
      id: 'metal-tracking',
      title: 'Отслеживание металла',
      description: 'Контроль испытаний материалов',
      path: '/metal-tracking',
      color: '#059669',
    },
    {
      id: 'work-closure',
      title: 'Закрытия',
      description: 'Завершение рабочих процессов',
      path: '/work-closure',
      color: '#D97706',
    },
    {
      id: 'document-tracking',
      title: 'Отслеживание документов',
      description: 'Контроль документооборота',
      path: '/document-tracking',
      color: '#DC2626',
    },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '24px',
    margin: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '16px',
    paddingTop: '100px',
    paddingBottom: '96px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
    color: 'white',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Кабинет 404
          </h1>
          <p style={{ opacity: 0.7 }}>
            Система управления рабочими процессами
          </p>
        </div>

        {/* Main Sections Grid */}
        <div style={gridStyle}>
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(section.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: section.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  {section.id === 'tasks' && '✓'}
                  {section.id === 'metal-tracking' && '🔍'}
                  {section.id === 'work-closure' && '✕'}
                  {section.id === 'document-tracking' && '📄'}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    {section.title}
                  </h3>
                  <p style={{ 
                    opacity: 0.7, 
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {section.description}
                  </p>
                </div>
              </div>

              <div style={{ 
                marginTop: '16px', 
                display: 'flex', 
                justifyContent: 'flex-end' 
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}>
                  →
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          style={{
            ...cardStyle,
            margin: '0',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Быстрая статистика
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60A5FA' }}>0</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Активных задач</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34D399' }}>0</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Завершено</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FBBF24' }}>0</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>В работе</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F87171' }}>0</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Просрочено</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SimpleHomePage;
