import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

type FilterType = 'all' | 'tasks' | 'metal' | 'closures';
type UserFilterType = 'all' | string;

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'metal' | 'closure';
  status: 'working' | 'completed' | 'overdue';
  userId?: string;
}

const CalendarPage: React.FC = () => {
  const { tasks, metalTracking, workClosures, users } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [userFilter, setUserFilter] = useState<UserFilterType>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Генерируем события из всех источников
  const allEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // События из задач
    tasks.forEach(task => {
      events.push({
        id: `task-${task.id}`,
        title: task.title,
        date: task.dueDate,
        type: 'task',
        status: task.status,
        userId: task.assigneeId,
      });
    });

    // События из отслеживания металла
    metalTracking.forEach(metal => {
      events.push({
        id: `metal-${metal.id}`,
        title: `Испытание: ${metal.factory}`,
        date: metal.testEndDate,
        type: 'metal',
        status: metal.status,
      });
    });

    // События из закрытий
    workClosures.forEach(closure => {
      events.push({
        id: `closure-${closure.id}`,
        title: `Закрытие: ${closure.factory}`,
        date: closure.endDate,
        type: 'closure',
        status: closure.status,
      });
    });

    return events;
  }, [tasks, metalTracking, workClosures]);

  // Фильтрованные события
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const typeMatch = typeFilter === 'all' || 
        (typeFilter === 'tasks' && event.type === 'task') ||
        (typeFilter === 'metal' && event.type === 'metal') ||
        (typeFilter === 'closures' && event.type === 'closure');

      const userMatch = userFilter === 'all' || event.userId === userFilter;

      return typeMatch && userMatch;
    });
  }, [allEvents, typeFilter, userFilter]);

  // Получаем дни месяца с учетом недель
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Понедельник
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // События для выбранной даты
  const selectedDateEvents = selectedDate 
    ? filteredEvents.filter(event => isSameDay(event.date, selectedDate))
    : [];

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'overdue': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task': return 'Задача';
      case 'metal': return 'Испытание';
      case 'closure': return 'Закрытие';
      default: return '';
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '16px',
    paddingTop: '64px',
    paddingBottom: '96px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '20px',
    margin: '12px 0',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '8px 16px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
  };

  const navigationButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    padding: window.innerWidth <= 768 ? '6px 12px' : '8px 16px',
    fontSize: window.innerWidth <= 768 ? '12px' : '14px',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
            Календарь
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
            Планирование и контроль сроков
          </p>
        </div>

        {/* Filters */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 16px 0' }}>
            Фильтры
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Type Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                Тип задач
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'Все' },
                  { key: 'tasks', label: 'Задачи' },
                  { key: 'metal', label: 'Испытания' },
                  { key: 'closures', label: 'Закрытия' },
                ].map((filter) => (
                  <motion.button
                    key={filter.key}
                    style={{
                      ...buttonStyle,
                      background: typeFilter === filter.key 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      borderColor: typeFilter === filter.key 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(255, 255, 255, 0.2)',
                    }}
                    onClick={() => setTypeFilter(filter.key as FilterType)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* User Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                Пользователь
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '14px',
                }}
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">Все пользователи</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <motion.button
              style={navigationButtonStyle}
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              whileTap={{ scale: 0.95 }}
            >
              ← Предыдущий
            </motion.button>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              {format(currentDate, 'LLLL yyyy', { locale: ru })}
            </h2>
            
            <motion.button
              style={navigationButtonStyle}
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              whileTap={{ scale: 0.95 }}
            >
              Следующий →
            </motion.button>
          </div>

          {/* Calendar Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '8px',
            marginBottom: '16px'
          }}>
            {/* Week days header */}
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div
                key={day}
                style={{
                  padding: '8px',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <motion.div
                  key={day.toISOString()}
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: isSelected 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : isToday(day) 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'transparent',
                    border: isToday(day) ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                    opacity: isCurrentMonth ? 1 : 0.5,
                    position: 'relative',
                  }}
                  onClick={() => setSelectedDate(day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Event indicators */}
                  {dayEvents.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', flexWrap: 'wrap' }}>
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <div
                          key={index}
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: getStatusColor(event.status),
                          }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          +{dayEvents.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <motion.div
            style={cardStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 16px 0' }}>
              События на {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedDateEvents.map((event) => {
                  const user = event.userId ? users.find(u => u.id === event.userId) : null;
                  
                  return (
                    <div
                      key={event.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${getStatusColor(event.status)}40`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0' }}>
                            {event.title}
                          </h4>
                          <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                            {getTypeLabel(event.type)}
                            {user && ` • ${user.name}`}
                          </div>
                        </div>
                        
                        <div
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: `${getStatusColor(event.status)}20`,
                            color: getStatusColor(event.status),
                            border: `1px solid ${getStatusColor(event.status)}40`,
                          }}
                        >
                          {event.status === 'completed' ? 'Выполнено' : 
                           event.status === 'overdue' ? 'Просрочено' : 'В работе'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
                <div style={{ fontSize: '1rem', marginBottom: '4px' }}>Событий не найдено</div>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>На эту дату нет запланированных событий</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Statistics */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 16px 0' }}>
            Статистика за месяц
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                {filteredEvents.filter(e => isSameMonth(e.date, currentDate) && e.status === 'working').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                В работе
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                {filteredEvents.filter(e => isSameMonth(e.date, currentDate) && e.status === 'completed').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Выполнено
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                {filteredEvents.filter(e => isSameMonth(e.date, currentDate) && e.status === 'overdue').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Просрочено
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarPage;
