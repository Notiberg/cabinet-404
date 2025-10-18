import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Главная',
      path: '/',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      id: 'calendar',
      label: 'Календарь',
      path: '/calendar',
      icon: CalendarDaysIcon,
      activeIcon: CalendarDaysIconSolid,
    },
    {
      id: 'profile',
      label: 'Профиль',
      path: '/profile',
      icon: UserIcon,
      activeIcon: UserIconSolid,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="glass-card mx-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = active ? item.activeIcon : item.icon;

            return (
              <motion.button
                key={item.id}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <IconComponent className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
                
                {active && (
                  <motion.div
                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-transparent" />
    </motion.div>
  );
};

export default BottomNavigation;
