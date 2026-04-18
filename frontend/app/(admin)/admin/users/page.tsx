'use client';

import { User } from '@/src/domain/entity/user.entity';
import UserModal from '@/src/presentation/components/admin/users/UserModal';
import UserTable from '@/src/presentation/components/admin/users/UserTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger';
import { Plus, Users, RefreshCw } from 'lucide-react'; // Added RefreshCw
import { useEffect, useState } from 'react';

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false); // New state for bulk update
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { logAction } = useActivityLogger();

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetUsersByPageUseCase.execute(page - 1, 10);
      setUsers(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  /**
   * Triggers the bulk status update for all users
   */
  const handleSyncHistoryStatus = async () => {
    setSyncing(true);
    try {
      await AppProviders.UpdateUserHistoryStatusUseCase.execute();
      await logAction("MAINTENANCE", "User", "Đã kích hoạt đồng bộ hóa trạng thái lịch sử hàng loạt");

      // Refresh the current page to see updated statuses
      await fetchUsers(currentPage);
      alert("Đã cập nhật trạng thái lịch sử mua hàng cho toàn bộ người dùng!");
    } catch (error) {
      console.error("Failed to sync statuses:", error);
      alert("Đồng bộ thất bại. Vui lòng kiểm tra nhật ký lỗi.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (data: User) => {
    let action = "UPDATE";
    try {
      if (selectedUser?.id) {
        await AppProviders.UpdateUserUseCase.execute(selectedUser.id, data);
        await logAction(action, "User", `Cập nhật người dùng: ${data.email} (ID: ${selectedUser.id})`);
      } else {
        action = "CREATE";
        await AppProviders.CreateUserUseCase.execute(data);
        await logAction(action, "User", `Tạo tài khoản người dùng mới: ${data.email}`);
      }
      fetchUsers(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      logAction(`${action}_FAILURE`, "User", `Không thể lưu người dùng: ${data.email}`);
      alert("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản: ${userToDelete?.email || 'người dùng này'}?`)) {
      try {
        await AppProviders.DeleteUserUseCase.execute(id);
        await logAction("DELETE", "User", `Đã xóa tài khoản người dùng: ${userToDelete?.email || id}`);
        fetchUsers(currentPage);
      } catch (error) {
        console.error("Failed to delete user:", error);
        logAction("DELETE_FAILURE", "User", `Không thể xóa người dùng ID: ${id}`);
        alert("Lỗi khi xóa người dùng.");
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <UserModal
        key={selectedUser?.id || 'new-user'}
        isOpen={isModalOpen}
        initialData={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Quản lý người dùng</h1>
          </div>
          <p className="text-sm text-emerald-900">Quản lý và giám sát người dùng cũng như phân quyền ứng dụng.</p>
        </div>

        <div className="flex gap-3">
          {/* New Sync Button */}
          <button
            onClick={handleSyncHistoryStatus}
            disabled={syncing}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Tính toán lại trạng thái lịch sử của tất cả người dùng"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Đang đồng bộ..." : "Đồng bộ lịch sử"}
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            Thêm người dùng mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-emerald-900 font-medium">
              Người dùng đã đăng ký: {users.length}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Trang {currentPage} trên {totalPages || 1}
            </span>
          </div>

          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Trước
            </button>

            <div className="flex items-center px-4 bg-emerald-600 rounded-lg text-white font-bold shadow-inner">
              {currentPage}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Tiếp
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
