'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ActivityLog } from '@/src/domain/entity/activity-log.entity';
import { AppProviders } from '@/src/provider/provider';
import { Constants } from '@/src/shared/constans';
import { History, RefreshCw, Search, Bell } from 'lucide-react';
import ActivityLogTable from '@/src/presentation/components/admin/activity-logs/ActivityLogTable';

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Constants.PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);

  // 1. WebSocket Setup for Real-time Monitoring
  useEffect(() => {
    const wsUrl = 'ws://localhost:8080/activity-logs';
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      try {
        const newLog: ActivityLog = JSON.parse(event.data);
        // Prepend new log and keep the UI fresh without full re-fetch
        setLogs((prev) => [newLog, ...prev].slice(0, 15));
        setUnreadCount((prev) => prev + 1);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  // 2. Data Fetching Logic (Standard REST)
  const fetchLogs = async (page: number, query: string = '') => {
    setLoading(true);
    try {
      let result;
      if (query.trim()) {
        result = await AppProviders.SearchActivityLogsUseCase.execute(query, page - 1, 15);
      } else {
        result = await AppProviders.GetActivityLogsByPageUseCase.execute(page - 1, 15);
      }
      setLogs(result.content);
      setTotalPages(result.totalPages);
      setUnreadCount(0); // Clear notification count on manual fetch
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLogs(1, searchQuery);
  };

  const handleRefresh = () => {
    fetchLogs(currentPage, searchQuery);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Cảnh báo: Việc xóa nhật ký không được khuyến khích vì mục đích kiểm tra. Tiếp tục?")) {
      try {
        await AppProviders.DeleteActivityLogUseCase.execute(id);
        fetchLogs(currentPage, searchQuery);
      } catch (error) {
        console.error("Failed to delete log:", error);
      }
    }
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="text-slate-700" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Nhật ký hoạt động hệ thống</h1>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-bounce">
                <Bell size={12} /> {unreadCount} mới
              </span>
            )}
          </div>
          <p className="text-sm text-emerald-900">Theo dõi tất cả các hành động quản trị và sự kiện hệ thống trong thời gian thực.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm hành động, thực thể..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </form>

          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-emerald-50 transition-all shadow-sm active:rotate-180 duration-500"
            title="Tải lại nhật ký"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          <p className="text-emerald-900 text-sm font-medium">Đang tải nhật ký kiểm tra...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-900 bg-slate-200/50 px-3 py-1.5 rounded-full">
              Tổng số trang: {totalPages}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Đang hiển thị trang {currentPage}
            </span>
          </div>

          <ActivityLogTable
            logs={logs}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Trước
            </button>

            <div className="flex items-center px-6 bg-emerald-600 rounded-lg text-white font-bold shadow-md">
              {currentPage}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogPage;
