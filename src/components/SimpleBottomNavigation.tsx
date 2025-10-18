import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const SimpleBottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getIcon = (iconType: string, active: boolean, hovered: boolean) => {
    const color = active ? 'white' : hovered ? 'white' : 'rgba(255, 255, 255, 0.7)';
    
    switch (iconType) {
      case 'home':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        );
      case 'calendar':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        );
      case 'profile':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Главная',
      path: '/',
      iconType: 'home',
    },
    {
      id: 'calendar',
      label: 'Календарь',
      path: '/calendar',
      iconType: 'calendar',
    },
    {
      id: 'profile',
      label: 'Профиль',
      path: '/profile',
      iconType: 'profile',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: 50,
    padding: '0 16px 20px 16px',
    display: 'flex',
    justifyContent: 'center',
  };

  const navStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 20px',
    minWidth: '240px',
    maxWidth: '320px',
    width: 'auto',
    gap: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRadius: '16px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: '11px',
    fontWeight: '500',
    minWidth: '50px',
    position: 'relative',
  };

  return (
    <motion.div 
      style={containerStyle}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div style={navStyle}>
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.id}
              style={{
                ...buttonStyle,
                background: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
              }}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={(e) => {
                if (!active) {
                  setHoveredItem(item.id);
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  setHoveredItem(null);
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                }
              }}
            >
              <div style={{ marginBottom: '2px' }}>
                {getIcon(item.iconType, active, hoveredItem === item.id)}
              </div>
              <span>
                {item.label}
              </span>
              
              {active && (
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.8)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SimpleBottomNavigation;
