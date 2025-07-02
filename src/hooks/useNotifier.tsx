// src/hooks/useNotifier.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import './useNotifier.css'; // For styling the notifications

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // in milliseconds
}

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifier = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifier must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  defaultDuration?: number; // Default duration for notifications
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  defaultDuration = 3000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = NotificationType.INFO, duration?: number) => {
      const id = new Date().getTime().toString() + Math.random().toString(36).substr(2, 9);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id, message, type, duration: duration || defaultDuration },
      ]);
    },
    [defaultDuration]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
        // Clear timer if the notification is removed manually or component unmounts
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, removeNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-toast notification-${notification.type}`}
            onClick={() => removeNotification(notification.id)} // Allow manual dismissal
          >
            {notification.message}
            <button
              className="notification-close-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent toast click event
                removeNotification(notification.id);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
