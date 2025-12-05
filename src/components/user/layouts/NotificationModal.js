import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './NotificationModal.css';

const notificationTypeMeta = type => {
  switch (type) {
    case 'delivery':
      return { icon: '📦', background: 'linear-gradient(135deg, #93c5fd, #60a5fa)' };
    case 'like':
      return { icon: '❤️', background: 'linear-gradient(135deg, #fca5a5, #f87171)' };
    case 'comment':
      return { icon: '💬', background: 'linear-gradient(135deg, #86efac, #4ade80)' };
    case 'promotion':
      return { icon: '🎁', background: 'linear-gradient(135deg, #c4b5fd, #a855f7)' };
    default:
      return { icon: '🔔', background: 'linear-gradient(135deg, #d1d5db, #9ca3af)' };
  }
};

const NotificationModal = ({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead, onDelete, onDeleteAll }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal-container" onClick={e => e.stopPropagation()}>
        <div className="notification-modal-header">
          <h2>알림 전체보기</h2>
          <div className="notification-modal-actions">
            <button type="button" className="action-btn read-all" onClick={onMarkAllRead}>
              모두 읽음
            </button>
            <button type="button" className="action-btn delete-all" onClick={onDeleteAll}>
              전체 삭제
            </button>
            <button type="button" className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="notification-modal-body">
          {notifications.length > 0 ? (
            <ul className="notification-modal-list">
              {notifications.map(item => {
                const meta = notificationTypeMeta(item.type);
                return (
                  <li
                    key={item.id}
                    className={`notification-modal-item ${item.unread ? 'unread' : ''}`}
                    onClick={() => onMarkRead(item.id)}
                  >
                    <div className="notification-modal-icon" style={{ background: meta.background }} aria-hidden="true">
                      {meta.icon}
                    </div>
                    <div className="notification-modal-content">
                      <div className="notification-modal-title-row">
                        <span className="notification-modal-title">{item.title}</span>
                        <span className="notification-modal-time">{item.timeAgo}</span>
                      </div>
                      <div className="notification-modal-message">{item.message}</div>
                    </div>
                    <div className="notification-modal-item-actions">
                      {item.unread && <span className="unread-dot" />}
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={e => onDelete(e, item.id)}
                        aria-label="삭제"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="notification-modal-empty">
              <p>알림이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
