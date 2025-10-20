import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../store';
import { PriorityType } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TasksPage: React.FC = () => {
  const { tasks, users, currentUser, addTask, updateTask, deleteTask } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'my' | 'overdue'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'overdue': return 'status-overdue';
      default: return 'status-working';
    }
  };

  const getPriorityLabel = (priority: PriorityType) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
    }
  };

  return (
    <div className="min-h-screen p-4 pt-16 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Задачи</h1>
            <p className="text-white/70">Управление задачами команды</p>
          </div>
          
          <motion.button
            className="glass-button p-3 rounded-xl"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
          >
            <PlusIcon className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'Все' },
            { key: 'my', label: 'Мои' },
            { key: 'overdue', label: 'Просроченные' },
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption.key
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
              onClick={() => setFilter(filterOption.key as any)}
              whileTap={{ scale: 0.95 }}
            >
              {filterOption.label}
            </motion.button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const assignee = users.find(u => u.id === task.assigneeId);
              
              return (
                <motion.div
                  key={task.id}
                  className="glass-card p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-white/70 text-sm mb-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? 'Выполнено' : 
                         task.status === 'overdue' ? 'Просрочено' : 'В работе'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/70">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{assignee?.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                          {format(task.dueDate, 'dd.MM.yyyy', { locale: ru })}
                        </span>
                      </div>
                    </div>

                    {task.status === 'overdue' && (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  {/* Task Actions */}
                  <div className="flex space-x-2 mt-3">
                    {task.status !== 'completed' && (
                      <motion.button
                        className="glass-button px-3 py-1 rounded-lg text-xs text-white"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateTask(task.id, { status: 'completed' })}
                      >
                        Завершить
                      </motion.button>
                    )}
                    
                    <motion.button
                      className="glass-button px-3 py-1 rounded-lg text-xs text-red-300"
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
            <div className="text-center py-12">
              <div className="text-white/50 text-lg mb-2">Задач не найдено</div>
              <p className="text-white/30 text-sm">
                {filter === 'all' ? 'Создайте первую задачу' : 'Попробуйте изменить фильтр'}
              </p>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                className="glass-card p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Новая задача
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Название задачи
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="Введите название задачи"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Описание (опционально)
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 resize-none"
                      rows={3}
                      placeholder="Описание задачи"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Приоритет
                    </label>
                    <select
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as PriorityType })}
                    >
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Исполнитель
                    </label>
                    <select
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
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
                    <label className="block text-white/70 text-sm mb-2">
                      Срок выполнения
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                      style={{ maxWidth: '200px', fontSize: '12px' }}
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    className="flex-1 glass-button py-3 rounded-lg text-white font-medium"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(false)}
                  >
                    Отмена
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 py-3 rounded-lg text-white font-medium transition-colors"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTask}
                    disabled={!newTask.title || !newTask.assigneeId || !newTask.dueDate}
                  >
                    Создать
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TasksPage;
