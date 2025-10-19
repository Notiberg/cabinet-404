import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';

const DocumentTrackingPage: React.FC = () => {
  const { documentTracking, currentUser, addDocumentTracking, updateDocumentTracking, deleteDocumentTracking } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newDocument, setNewDocument] = useState({
    factory: '',
    diameter: '',
    thickness: '',
    melt: '',
  });

  const handleAddDocument = () => {
    if (!newDocument.factory || !newDocument.diameter || !newDocument.thickness || !newDocument.melt) return;

    addDocumentTracking({
      factory: newDocument.factory,
      diameter: newDocument.diameter,
      thickness: newDocument.thickness,
      melt: newDocument.melt,
    });

    setNewDocument({
      factory: '',
      diameter: '',
      thickness: '',
      melt: '',
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(40, 167, 69, 0.2)', border: 'rgba(40, 167, 69, 0.4)', color: '#28a745' };
      case 'signing': return { bg: 'rgba(255, 193, 7, 0.2)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' };
      default: return { bg: 'rgba(220, 53, 69, 0.2)', border: 'rgba(220, 53, 69, 0.4)', color: '#dc3545' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'signing': return 'На подписании';
      default: return 'В работе';
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '16px',
    paddingTop: '80px',
    paddingBottom: '96px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '20px',
    margin: '12px 0',
    color: 'white',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 24px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
              Отслеживание документов
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Контроль документооборота
            </p>
          </div>
          
          {currentUser && (
            <motion.button
              style={buttonStyle}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              + Добавить
            </motion.button>
          )}
        </div>

        {/* Document Tracking List */}
        <div>
          <AnimatePresence>
            {documentTracking.map((document, index) => {
              const statusStyle = getStatusColor(document.status);
              
              return (
                <motion.div
                  key={document.id}
                  style={cardStyle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {document.factory}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        Типоразмер: ⌀{document.diameter}мм, толщина {document.thickness}мм
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Плавка: {document.melt}
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                      color: statusStyle.color,
                    }}>
                      {getStatusLabel(document.status)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {document.status === 'working' && (
                      <motion.button
                        style={{
                          ...buttonStyle,
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          background: 'rgba(255, 193, 7, 0.2)',
                          borderColor: 'rgba(255, 193, 7, 0.4)',
                          color: '#ffc107',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateDocumentTracking(document.id, { status: 'signing' })}
                      >
                        На подписание
                      </motion.button>
                    )}

                    {document.status === 'signing' && (
                      <motion.button
                        style={{
                          ...buttonStyle,
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          background: 'rgba(40, 167, 69, 0.2)',
                          borderColor: 'rgba(40, 167, 69, 0.4)',
                          color: '#28a745',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateDocumentTracking(document.id, { status: 'completed' })}
                      >
                        Завершить
                      </motion.button>
                    )}

                    {document.status !== 'completed' && (
                      <motion.button
                        style={{
                          ...buttonStyle,
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          background: 'rgba(40, 167, 69, 0.2)',
                          borderColor: 'rgba(40, 167, 69, 0.4)',
                          color: '#28a745',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateDocumentTracking(document.id, { status: 'completed' })}
                      >
                        Выполнено
                      </motion.button>
                    )}
                    
                    <motion.button
                      style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        color: '#f87171',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteDocumentTracking(document.id)}
                    >
                      Удалить
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {documentTracking.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
              <div style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Записей не найдено</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Добавьте первую запись о документе</p>
            </div>
          )}
        </div>

        {/* Add Document Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                zIndex: 50,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                style={{
                  ...cardStyle,
                  width: '100%',
                  maxWidth: '500px',
                  maxHeight: '85vh',
                  margin: '0',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px', margin: '0 0 20px 0' }}>
                  Новый документ
                </h3>

                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  paddingRight: '4px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '120px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Завод
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder="Введите название завода"
                      value={newDocument.factory}
                      onChange={(e) => setNewDocument({ ...newDocument, factory: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        Диаметр (мм)
                      </label>
                      <input
                        type="number"
                        style={inputStyle}
                        placeholder="Диаметр"
                        value={newDocument.diameter}
                        onChange={(e) => setNewDocument({ ...newDocument, diameter: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        Толщина стенки (мм)
                      </label>
                      <input
                        type="number"
                        style={inputStyle}
                        placeholder="Толщина"
                        value={newDocument.thickness}
                        onChange={(e) => setNewDocument({ ...newDocument, thickness: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Плавка
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder="Номер плавки"
                      value={newDocument.melt}
                      onChange={(e) => setNewDocument({ ...newDocument, melt: e.target.value })}
                    />
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  }}>
                  <motion.button
                    style={{ ...buttonStyle, flex: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(false)}
                  >
                    Отмена
                  </motion.button>
                  
                  <motion.button
                    style={{
                      ...buttonStyle,
                      flex: 1,
                      background: '#3b82f6',
                      borderColor: '#3b82f6',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddDocument}
                    disabled={!newDocument.factory || !newDocument.diameter || !newDocument.thickness || !newDocument.melt}
                  >
                    Создать
                  </motion.button>
                  </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DocumentTrackingPage;
