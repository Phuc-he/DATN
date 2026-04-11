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
      await logAction("MAINTENANCE", "User", "Triggered bulk history status synchronization");

      // Refresh the current page to see updated statuses
      await fetchUsers(currentPage);
      alert("Đã cập nhật trạng thái lịch sử mua hàng cho toàn bộ người dùng!");
    } catch (error) {
      console.error("Failed to sync statuses:", error);
      alert("Đồng bộ thất bại. Vui lòng kiểm tra console.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (data: User) => {
    let action = "UPDATE";
    try {
      if (selectedUser?.id) {
        await AppProviders.UpdateUserUseCase.execute(selectedUser.id, data);
        await logAction(action, "User", `Updated user: ${data.email} (ID: ${selectedUser.id})`);
      } else {
        action = "CREATE";
        await AppProviders.CreateUserUseCase.execute(data);
        await logAction(action, "User", `Created new user account: ${data.email}`);
      }
      fetchUsers(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      logAction(`${action}_FAILURE`, "User", `Failed to save user: ${data.email}`);
      alert("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (window.confirm(`Are you sure you want to delete account: ${userToDelete?.email || 'this user'}?`)) {
      try {
        await AppProviders.DeleteUserUseCase.execute(id);
        await logAction("DELETE", "User", `Deleted user account: ${userToDelete?.email || id}`);
        fetchUsers(currentPage);
      } catch (error) {
        console.error("Failed to delete user:", error);
        logAction("DELETE_FAILURE", "User", `Failed to delete user ID: ${id}`);
        alert("Error deleting user.");
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
            <h1 className="text-2xl font-bold text-slate-950">User Management</h1>
          </div>
          <p className="text-sm text-emerald-900">Manage and oversee your application users and permissions.</p>
        </div>

        <div className="flex gap-3">
          {/* New Sync Button */}
          <button
            onClick={handleSyncHistoryStatus}
            disabled={syncing}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Recalculate all user history statuses"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync History Status"}
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            Add New User
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
              Registered Users: {users.length}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Page {currentPage} of {totalPages || 1}
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
              Previous
            </button>

            <div className="flex items-center px-4 bg-emerald-600 rounded-lg text-white font-bold shadow-inner">
              {currentPage}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
