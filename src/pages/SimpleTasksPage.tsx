import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { PriorityType } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const SimpleTasksPage: React.FC = () => {
  const { tasks, users, currentUser, addTask, updateTask, deleteTask } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'my' | 'overdue'>('all');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as PriorityType,
    assigneeId: '',
    dueDate: '',
  });

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'my':
        return task.assigneeId === currentUser?.id;
      case 'overdue':
        return task.status === 'overdue';
      default:
        return true;
    }
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assigneeId || !newTask.dueDate || !currentUser) return;

    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      assigneeId: newTask.assigneeId,
      createdBy: currentUser.id,
      dueDate: new Date(newTask.dueDate),
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: '',
      dueDate: '',
    });
    setShowAddForm(false);
  };

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case 'high': return { bg: 'rgba(220, 53, 69, 0.2)', border: 'rgba(220, 53, 69, 0.4)', color: '#dc3545' };
      case 'medium': return { bg: 'rgba(255, 193, 7, 0.2)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' };
      case 'low': return { bg: 'rgba(40, 167, 69, 0.2)', border: 'rgba(40, 167, 69, 0.4)', color: '#28a745' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(40, 167, 69, 0.2)', border: 'rgba(40, 167, 69, 0.4)', color: '#28a745' };
      case 'overdue': return { bg: 'rgba(220, 53, 69, 0.2)', border: 'rgba(220, 53, 69, 0.4)', color: '#dc3545' };
      default: return { bg: 'rgba(255, 193, 7, 0.2)', border: 'rgba(255, 193, 7, 0.4)', color: '#ffc107' };
    }
  };

  const getPriorityLabel = (priority: PriorityType) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
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
              Задачи
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Управление задачами команды
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

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Все' },
            { key: 'my', label: 'Мои' },
            { key: 'overdue', label: 'Просроченные' },
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                background: filter === filterOption.key 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: filter === filterOption.key 
                  ? 'white' 
                  : 'rgba(255, 255, 255, 0.7)',
              }}
              onClick={() => setFilter(filterOption.key as any)}
              whileTap={{ scale: 0.95 }}
            >
              {filterOption.label}
            </motion.button>
          ))}
        </div>

        {/* Tasks List */}
        <div>
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const assignee = users.find(u => u.id === task.assigneeId);
              const priorityStyle = getPriorityColor(task.priority);
              const statusStyle = getStatusColor(task.status);
              
              return (
                <motion.div
                  key={task.id}
                  style={cardStyle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: '0 0 8px 0' }}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: priorityStyle.bg,
                        border: `1px solid ${priorityStyle.border}`,
                        color: priorityStyle.color,
                      }}>
                        {getPriorityLabel(task.priority)}
                      </div>
                      
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.border}`,
                        color: statusStyle.color,
                      }}>
                        {getStatusLabel(task.status)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>●</span>
                        <span>{assignee?.name}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>◐</span>
                        <span>
                          {format(task.dueDate, 'dd.MM.yyyy', { locale: ru })}
                        </span>
                      </div>
                    </div>

                    {task.status === 'overdue' && (
                      <span style={{ color: '#dc3545', fontSize: '1rem' }}>▲</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {task.status !== 'completed' && (
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
                        onClick={() => updateTask(task.id, { status: 'completed' })}
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
                      onClick={() => deleteTask(task.id)}
                    >
                      Удалить
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
              <div style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Задач не найдено</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                {filter === 'all' ? 'Создайте первую задачу' : 'Попробуйте изменить фильтр'}
              </p>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
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
                  Новая задача
                </h3>

                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  paddingRight: '4px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '120px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Название задачи
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder="Введите название задачи"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Описание (опционально)
                    </label>
                    <textarea
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        minHeight: '80px',
                      }}
                      placeholder="Описание задачи"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Приоритет
                    </label>
                    <select
                      style={inputStyle}
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as PriorityType })}
                    >
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Исполнитель
                    </label>
                    <select
                      style={inputStyle}
                      value={newTask.assigneeId}
                      onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    >
                      <option value="">Выберите исполнителя</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                      Срок выполнения
                    </label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
                      opacity: (!newTask.title || !newTask.assigneeId || !newTask.dueDate) ? 0.5 : 1,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTask}
                    disabled={!newTask.title || !newTask.assigneeId || !newTask.dueDate}
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

export default SimpleTasksPage;
