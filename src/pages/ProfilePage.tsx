import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';

const ProfilePage: React.FC = () => {
  const { currentUser, users, tasks, setCurrentUser } = useAppStore();
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Проверяем авторизацию при загрузке компонента
  React.useEffect(() => {
    setShowLogin(!currentUser);
  }, [currentUser]);

  const handleLogin = () => {
    // Очищаем ошибку перед попыткой входа
    setLoginError('');
    
    // Проверяем, что поля заполнены
    if (!loginData.login.trim() || !loginData.password.trim()) {
      setLoginError('Заполните все поля');
      return;
    }
    
    console.log('Попытка входа:', loginData);
    console.log('Доступные пользователи:', users);
    
    // Ищем пользователя с точным совпадением (убираем лишние пробелы)
    const user = users.find(u => 
      u.login && u.password && 
      u.login.trim() === loginData.login.trim() && 
      u.password.trim() === loginData.password.trim()
    );
    console.log('Найденный пользователь:', user);
    
    if (user) {
      setCurrentUser(user);
      setShowLogin(false);
      setLoginError('');
      // Очищаем поля после успешного входа
      setLoginData({ login: '', password: '' });
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setActiveSection(null);
  };

  const getUserTasks = () => {
    return tasks.filter(task => task.assigneeId === currentUser?.id);
  };

  const getUserStats = () => {
    const userTasks = getUserTasks();
    const completed = userTasks.filter(task => task.status === 'completed').length;
    const total = userTasks.length;
    const overdue = userTasks.filter(task => task.status === 'overdue').length;
    
    return { completed, total, overdue, completionRate: total > 0 ? (completed / total) * 100 : 0 };
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '16px',
    paddingTop: '80px',
    paddingBottom: '96px',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    padding: '12px 24px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    boxSizing: 'border-box',
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

  if (showLogin) {
    return (
      <div style={containerStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%' }}
        >
          <div style={cardStyle}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', margin: '0 0 32px 0' }}>
              Вход в систему
            </h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', margin: '0 auto' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                  Логин
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="Введите логин"
                  value={loginData.login}
                  onChange={(e) => {
                    setLoginData({ ...loginData, login: e.target.value });
                    setLoginError(''); // Очищаем ошибку при изменении
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                  Пароль
                </label>
                <input
                  type="password"
                  style={inputStyle}
                  placeholder="Введите пароль"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                    setLoginError(''); // Очищаем ошибку при изменении
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {loginError && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              <motion.button
                style={{
                  ...buttonStyle,
                  background: (loginData.login.trim() && loginData.password.trim()) ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)',
                  borderColor: (loginData.login.trim() && loginData.password.trim()) ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)',
                  marginTop: '16px',
                  cursor: (loginData.login.trim() && loginData.password.trim()) ? 'pointer' : 'not-allowed',
                }}
                whileTap={{ scale: (loginData.login.trim() && loginData.password.trim()) ? 0.95 : 1 }}
                onClick={handleLogin}
                disabled={!loginData.login.trim() || !loginData.password.trim()}
              >
                Войти
              </motion.button>
            </div>

            <div style={{ marginTop: '32px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Доступные пользователи:</h3>
              {users.map(user => (
                <div key={user.id} style={{ 
                  marginBottom: '8px', 
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}>
                  <div>
                    <strong>{user.login}</strong> - {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>
                    {user.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%' }}
      >
        {/* User Profile Header */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}>
              {currentUser?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {currentUser?.name}
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 8px 0' }}>
                {currentUser?.position}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', margin: 0 }}>
                @{currentUser?.login}
              </p>
            </div>

            <motion.button
              style={{
                ...buttonStyle,
                padding: '8px 16px',
                fontSize: '0.875rem',
                color: '#f87171',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              Выйти
            </motion.button>
          </div>
        </div>

        {/* Profile Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {/* Tasks Section */}
          <motion.div
            style={{
              ...cardStyle,
              cursor: 'pointer',
              textAlign: 'center',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('tasks')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 4px 0' }}>Задачи</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: 0 }}>
              {getUserTasks().length} задач
            </p>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            style={{
              ...cardStyle,
              cursor: 'pointer',
              textAlign: 'center',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('stats')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 4px 0' }}>Статистика</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: 0 }}>
              {Math.round(getUserStats().completionRate)}% выполнено
            </p>
          </motion.div>

          {/* Documents Section */}
          <motion.div
            style={{
              ...cardStyle,
              cursor: 'pointer',
              textAlign: 'center',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('documents')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 4px 0' }}>Документы</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: 0 }}>
              Личные файлы
            </p>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            style={{
              ...cardStyle,
              cursor: 'pointer',
              textAlign: 'center',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('settings')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚙️</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 4px 0' }}>Настройки</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: 0 }}>
              Пользователи
            </p>
          </motion.div>
        </div>

        {/* Active Section Content */}
        <AnimatePresence>
          {activeSection && (
            <motion.div
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                  {activeSection === 'tasks' && 'Мои задачи'}
                  {activeSection === 'stats' && 'Статистика'}
                  {activeSection === 'documents' && 'Документы'}
                  {activeSection === 'settings' && 'Пользователи'}
                </h3>
                <motion.button
                  style={{
                    ...buttonStyle,
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(null)}
                >
                  ✕
                </motion.button>
              </div>

              {activeSection === 'tasks' && (
                <div>
                  {getUserTasks().length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {getUserTasks().map(task => (
                        <div
                          key={task.id}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0' }}>
                            {task.title}
                          </h4>
                          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: '0 0 8px 0' }}>
                            {task.description}
                          </p>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              background: task.status === 'completed' ? '#28a745' : task.status === 'overdue' ? '#dc3545' : '#ffc107',
                              color: 'white',
                            }}>
                              {task.status === 'completed' ? 'Выполнено' : task.status === 'overdue' ? 'Просрочено' : 'В работе'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                              {task.dueDate.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
                      <div style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Задач не найдено</div>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>У вас пока нет назначенных задач</p>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'stats' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                        {getUserStats().completed}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Выполнено
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                        {getUserStats().total - getUserStats().completed - getUserStats().overdue}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        В работе
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
                        {getUserStats().overdue}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Просрочено
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {Math.round(getUserStats().completionRate)}%
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Эффективность
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'documents' && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255, 255, 255, 0.5)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📁</div>
                  <div style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Раздел в разработке</div>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    Здесь будет возможность загружать и скачивать личные документы
                  </p>
                </div>
              )}

              {activeSection === 'settings' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {users.map(user => (
                      <div
                        key={user.id}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: user.id === currentUser?.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${user.id === currentUser?.id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                          }}>
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 2px 0' }}>
                              {user.name}
                            </h4>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: '0 0 2px 0' }}>
                              {user.position}
                            </p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', margin: 0 }}>
                              @{user.login}
                            </p>
                          </div>
                          
                          {user.id === currentUser?.id && (
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                            }}>
                              Текущий
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
