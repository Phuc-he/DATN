'use client';

import { User } from '@/src/domain/entity/user.entity';
import UserModal from '@/src/presentation/components/admin/users/UserModal';
import UserTable from '@/src/presentation/components/admin/users/UserTable';
import { AppProviders } from '@/src/provider/provider';
import { Plus } from 'lucide-react'; // Import Plus icon
import { useEffect, useState } from 'react';

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSave = async (data: User) => {
    try {
      if (selectedUser) {
        await AppProviders.UpdateUserUseCase.execute(selectedUser.id!, data);
      } else {
        await AppProviders.CreateUserUseCase.execute(data);
      }
      fetchUsers(currentPage); // Refresh table
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Operation failed. Check console for details.");
    }
  };

  // Update handleEdit to:
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Update handleCreate to:
  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetUsersByPageUseCase.execute(page - 1, 10);
      console.log(result);
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AppProviders.DeleteUserUseCase.execute(id);
        fetchUsers(currentPage);
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Error deleting user");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <UserModal key={selectedUser?.id || 'new'} isOpen={isModalOpen} initialData={selectedUser} onClose={function (): void {
        setIsModalOpen(false);
      }} onSave={function (user: User): void {
        handleSave(user);
      }} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">Manage and oversee your application users.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <span className="text-xs font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Previous
            </button>

            <div className="flex items-center px-4 bg-slate-200/30 rounded-lg text-slate-700 font-medium">
              {currentPage}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
