import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const WorkClosurePage: React.FC = () => {
  const { workClosures, currentUser, addWorkClosure, updateWorkClosure, deleteWorkClosure } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newWork, setNewWork] = useState({
    factory: '',
    diameter: '',
    thickness: '',
    melt: '',
    startDate: '',
    endDate: '',
  });

  const handleAddWork = () => {
    if (!newWork.factory || !newWork.diameter || !newWork.thickness || !newWork.melt || !newWork.startDate || !newWork.endDate) return;

    addWorkClosure({
      factory: newWork.factory,
      diameter: newWork.diameter,
      thickness: newWork.thickness,
      melt: newWork.melt,
      startDate: new Date(newWork.startDate),
      endDate: new Date(newWork.endDate),
    });

    setNewWork({
      factory: '',
      diameter: '',
      thickness: '',
      melt: '',
      startDate: '',
      endDate: '',
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(40, 167, 69, 0.2)', border: 'rgba(40, 167, 69, 0.4)', color: '#28a745' };
      case 'overdue': return { bg: 'rgba(220, 53, 69, 0.2)', border: 'rgba(220, 53, 69, 0.4)', color: '#dc3545' };
      default: return { bg: 'rgba(255, 193, 7, 0.2)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'overdue': return 'Просрочено';
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
              Закрытия
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Завершение рабочих процессов
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

        {/* Work Closures List */}
        <div>
          <AnimatePresence>
            {workClosures.map((work, index) => {
              const statusStyle = getStatusColor(work.status);
              
              return (
                <motion.div
                  key={work.id}
                  style={cardStyle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {work.factory}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        Типоразмер: ⌀{work.diameter}мм, толщина {work.thickness}мм
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Плавка: {work.melt}
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
                      {getStatusLabel(work.status)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                        Дата начала работ
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        {format(work.startDate, 'dd.MM.yyyy', { locale: ru })}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                        Дата окончания работ
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        {format(work.endDate, 'dd.MM.yyyy', { locale: ru })}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                        Длительность
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        {Math.ceil((work.endDate.getTime() - work.startDate.getTime()) / (1000 * 60 * 60 * 24))} дней
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {work.status !== 'completed' && (
                      <motion.button
                        style={{
                          ...buttonStyle,
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateWorkClosure(work.id, { status: 'completed' })}
                      >
                        Завершить
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
                      onClick={() => deleteWorkClosure(work.id)}
                    >
                      Удалить
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {workClosures.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
              <div style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Записей не найдено</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Добавьте первую запись о закрытии работ</p>
            </div>
          )}
        </div>

        {/* Add Work Closure Modal */}
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
                  Новое закрытие работ
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
                      value={newWork.factory}
                      onChange={(e) => setNewWork({ ...newWork, factory: e.target.value })}
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
                        value={newWork.diameter}
                        onChange={(e) => setNewWork({ ...newWork, diameter: e.target.value })}
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
                        value={newWork.thickness}
                        onChange={(e) => setNewWork({ ...newWork, thickness: e.target.value })}
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
                      value={newWork.melt}
                      onChange={(e) => setNewWork({ ...newWork, melt: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        Дата начала работ
                      </label>
                      <input
                        type="date"
                        style={inputStyle}
                        value={newWork.startDate}
                        onChange={(e) => setNewWork({ ...newWork, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        Дата окончания работ
                      </label>
                      <input
                        type="date"
                        style={inputStyle}
                        value={newWork.endDate}
                        onChange={(e) => setNewWork({ ...newWork, endDate: e.target.value })}
                      />
                    </div>
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
                    onClick={handleAddWork}
                    disabled={!newWork.factory || !newWork.diameter || !newWork.thickness || !newWork.melt || !newWork.startDate || !newWork.endDate}
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

export default WorkClosurePage;
