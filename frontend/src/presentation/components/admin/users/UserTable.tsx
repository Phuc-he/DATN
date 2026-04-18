import React from 'react';
import { Edit, Trash2, ShieldCheck, User, BookOpen, History, AlertTriangle, CheckCircle } from 'lucide-react';
import { User as UserEntity } from '@/src/domain/entity/user.entity';
import Image from 'next/image';
import { Role, RoleLabels, isAdmin, isAuthor } from '@/src/domain/entity/role.enum';
import { UserHistoryStatus } from '@/src/domain/entity/user-history-status.enum';

interface UserTableProps {
  users: UserEntity[];
  onEdit: (user: UserEntity) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  
  // Helper to render History Status Badges
  const renderHistoryBadge = (status?: UserHistoryStatus) => {
    switch (status) {
      case UserHistoryStatus.GOOD_HISTORY:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle size={12} className="mr-1" /> Lịch sử tốt
          </span>
        );
      case UserHistoryStatus.BOOM_HISTORY:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle size={12} className="mr-1" /> Từng boom hàng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <History size={12} className="mr-1" /> Khách mới
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Người dùng</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Vai trò</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Lịch sử</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Liên hệ</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Địa chỉ</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Tham gia</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-800 uppercase">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-emerald-50 transition-colors">
              {/* Profile & Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 relative">
                    {user.avatar ? (
                      <Image 
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200" 
                        src={user.avatar} 
                        alt={user.username} 
                        width={40} 
                        height={40} 
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-emerald-800 ring-1 ring-slate-200">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-slate-950">{user.fullName || user.username}</div>
                    <div className="text-sm text-emerald-800">{user.email}</div>
                  </div>
                </div>
              </td>

              {/* Dynamic Role Badges */}
              <td className="px-6 py-4 whitespace-nowrap">
                {isAdmin(user.role) ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <ShieldCheck size={12} className="mr-1" /> {RoleLabels[Role.ADMIN]}
                  </span>
                ) : isAuthor(user.role) ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <BookOpen size={12} className="mr-1" /> {RoleLabels[Role.AUTHOR]}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {RoleLabels[Role.CUSTOMER]}
                  </span>
                )}
              </td>

              {/* History Status Badge */}
              <td className="px-6 py-4 whitespace-nowrap">
                {renderHistoryBadge(user.historyStatus)}
              </td>

              {/* Contact */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {user.phone || <span className="text-slate-400 italic text-xs">Không có số điện thoại</span>}
              </td>

              {/* Location */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                <span className="truncate max-w-[150px] block">
                   {user.address || <span className="text-slate-400 italic text-xs">Chưa thiết lập</span>}
                </span>
              </td>

              {/* Date Joined */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onEdit(user)}
                  className="text-emerald-600 hover:text-emerald-900 mr-4 transition-all hover:scale-110 p-1 rounded-lg hover:bg-emerald-50"
                  title="Chỉnh sửa người dùng"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => user.id && onDelete(user.id)}
                  className="text-red-600 hover:text-red-900 transition-all hover:scale-110 p-1 rounded-lg hover:bg-red-50"
                  disabled={!user.id}
                  title="Xóa người dùng"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
