import React, { useState, useEffect, useRef } from 'react';
import { AuthService } from '@/src/presentation/services/auth.service';
import { ActivityLog } from '@/src/domain/entity/activity-log.entity';
import {
  Book,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Ticket,
  Users,
  Bell,
  Clock,
  MessageSquare
} from 'lucide-react';

const AdminSidebar = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  // 1. Establish WebSocket Connection
  useEffect(() => {
    // Replace with your actual backend URL
    const wsUrl = 'ws://localhost:8080/activity-logs';
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const newLog: ActivityLog = JSON.parse(event.data);
      setLogs((prev) => [newLog, ...prev].slice(0, 10)); // Keep only last 10
      setUnreadCount((prev) => prev + 1);
    };

    return () => socketRef.current?.close();
  }, []);

  const menuItems = [
    { name: 'Bảng điều khiển', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Người dùng', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Tác giả', icon: <Book size={20} />, path: '/admin/authors' },
    { name: 'Danh mục', icon: <Layers size={20} />, path: '/admin/categories' },
    { name: 'Sản phẩm', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Đơn hàng', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Mã giảm giá', icon: <Ticket size={20} />, path: '/admin/vouchers' },
    { name: 'Cài đặt', icon: <Settings size={20} />, path: '/admin/settings' },
    { name: 'Nhật ký', icon: <Bell size={20} />, path: '/admin/activity-logs' },
    { name: 'Tin nhắn', icon: <MessageSquare size={20} />, path: '/admin/messages' },
  ];

  return (
    <div className="flex flex-col w-64 h-screen bg-slate-950 text-slate-100 border-r border-slate-800 relative">
      <div className="flex items-center justify-between px-4 h-20 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-emerald-400 uppercase">
          Quản trị
        </h1>
        
        {/* 2. Notification Bell UI */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className="p-2 text-slate-400 hover:text-emerald-400 transition-colors relative"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 3. Dropdown Menu for Logs */}
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
              <div className="p-3 border-b border-slate-700 font-bold text-sm text-slate-300">
                Nhật ký hoạt động gần đây
              </div>
              {logs.length === 0 ? (
                <div className="p-4 text-center text-emerald-800 text-sm">Không có hoạt động gần đây</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="p-3 border-b border-slate-700 hover:bg-slate-750 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.action.includes('DELETE') ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-emerald-800 flex items-center">
                        <Clock size={10} className="mr-1" /> Vừa xong
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-semibold">{log.entityName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className="flex items-center px-4 py-3 transition-colors rounded-lg hover:bg-slate-800 hover:text-emerald-400 group"
          >
            <span className="text-slate-400 group-hover:text-emerald-400">
              {item.icon}
            </span>
            <span className="ml-3 font-medium">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          className="flex items-center w-full px-4 py-3 text-slate-400 transition-colors rounded-lg hover:bg-red-900/20 hover:text-red-400" 
          onClick={() => AuthService.logout()}
        >
          <LogOut size={20} />
          <span className="ml-3 font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
