import { User } from '@/src/domain/entity/user.entity';
import { ChevronRight, MessageCircle, User as UserIcon } from 'lucide-react';

export interface Room {
  user: User;
  lastMessage: string;
  timestamp: string | Date; // Chấp nhận cả hai để tránh lỗi format
  unreadCount?: number;     // Thêm vào để dùng sau này nếu cần
}

const RoomList = ({ rooms, onSelectRoom }: { rooms: Room[], onSelectRoom: (user: User) => void }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle size={18} className="text-blue-600" />
          Active Conversations
        </h3>
      </div>
      
      <div className="divide-y divide-slate-100">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div 
              key={room.user.id}
              onClick={() => onSelectRoom(room.user)}
              className="flex items-center justify-between p-4 hover:bg-blue-50/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                  <UserIcon size={24} />
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {room.user.fullName || `User #${room.user.id}`}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-1 max-w-[300px]">
                    {room.lastMessage}
                  </p>

                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-slate-400">Last active</p>
                  <p className="text-xs text-slate-600">
                    {new Date(room.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400">
            No active rooms found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;