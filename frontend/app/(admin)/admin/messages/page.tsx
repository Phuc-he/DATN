'use client';

import { MessageSender } from '@/src/domain/entity/message-sender.enum';
import { Message } from '@/src/domain/entity/message.entity';
import { User } from '@/src/domain/entity/user.entity';
import { AdminChatPopup } from '@/src/presentation/components/admin/messages/AdminChatPopup';
import MessageModal from '@/src/presentation/components/admin/messages/MessageModal';
import MessageTable from '@/src/presentation/components/admin/messages/MessageTable';
import RoomList, { Room } from '@/src/presentation/components/admin/messages/RoomList';
import TrainView from '@/src/presentation/components/admin/messages/TrainView';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger';
import { AppProviders } from '@/src/provider/provider';
import { LayoutGrid, List, Mail, MessageSquare, Terminal, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

const MessagePage = () => {
  const [view, setView] = useState<'messages' | 'rooms'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

  const [showTrainView, setShowTrainView] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const handleStartTraining = async () => {
    setIsTraining(true);
    try {
      // This calls the @PostMapping("/train") in your Kotlin Controller
      await AppProviders.TrainAiModelUseCase.execute();
    } catch (error) {
      console.error("Training failed to trigger:", error);
    } finally {
      setIsTraining(false);
    }
  };

  const fetchMessages = async (page: number) => {
    setLoading(true);
    try {
      // Assuming your UseCase follows the same pagination pattern
      const result = await AppProviders.GetMessagesByPageUseCase.execute(page - 1, 10);
      setMessages(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/message'); // Adjust to your backend URL

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      try {
        const receivedMessage: Message = JSON.parse(event.data);

        setMessages((prevMessages) => {
          // Check if message already exists (to handle updates vs creates)
          const index = prevMessages.findIndex(m => m.id === receivedMessage.id);

          if (index !== -1) {
            // If it exists, update it in the list
            const updatedList = [...prevMessages];
            updatedList[index] = receivedMessage;
            return updatedList;
          } else {
            // If it's new, add it to the top (assuming newest first)
            return [receivedMessage, ...prevMessages.slice(0, 9)];
          }
        });
      } catch (error) {
        console.error("Error parsing real-time message:", error);
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  const handleSave = async (data: Message) => {
    let action = "UPDATE";
    try {
      // Nếu là ReplyMode, chúng ta coi như tạo mới hoàn toàn (không gửi ID cũ)
      if (selectedMessage?.id && !isReplyMode) {
        await AppProviders.UpdateMessageUseCase.execute(selectedMessage.id, data);
        await logAction(action, "Message", `Cập nhật tin nhắn ID: ${selectedMessage.id}`);
      } else {
        action = "CREATE";
        // Đảm bảo data gửi đi không chứa ID để Backend nhận diện là INSERT
        const payload = { ...data, id: undefined };
        await AppProviders.CreateMessageUseCase.execute(payload as Message);
        await logAction(action, "Message", `Admin đã trả lời ${data.user?.fullName}`);
      }
      fetchMessages(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save message:", error);
      logAction(`${action}_FAILURE`, "Message", `Không thể lưu tin nhắn`);
      alert("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tin nhắn #${id}?`)) {
      try {
        await AppProviders.DeleteMessageUseCase.execute(id);
        await logAction("DELETE", "Message", `Đã xóa tin nhắn ID: ${id}`);
        fetchMessages(currentPage);
      } catch (error) {
        console.error("Failed to delete message:", error);
        logAction("DELETE_FAILURE", "Message", `Không thể xóa tin nhắn ID: ${id}`);
        alert("Lỗi khi xóa tin nhắn.");
      }
    }
  };

  const handleEdit = (message: Message) => {
    setSelectedMessage(message);
    setIsReplyMode(false);
    setIsModalOpen(true);
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message); // Truyền tin nhắn của User vào để lấy context
    setIsReplyMode(true);
    setIsModalOpen(true);
  };

  const getRoomsFromMessages = (messages: Message[]): Room[] => {
    const roomsMap = new Map<number, Room>();

    // Sort để lấy tin nhắn mới nhất
    const sortedMessages = [...messages].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    sortedMessages.forEach(msg => {
      const userId = msg.user?.id;
      if (!userId) return;

      if (!roomsMap.has(userId)) {
        roomsMap.set(userId, {
          user: msg.user!,
          lastMessage: msg.content,
          timestamp: msg.createdAt || new Date().toISOString(), // Đổi tên từ lastTimestamp thành timestamp
          unreadCount: 0
        });
      }

      if (msg.sender === MessageSender.USER) {
        const room = roomsMap.get(userId);
        if (room) room.unreadCount = (room.unreadCount || 0) + 1;
      }
    });

    return Array.from(roomsMap.values());
  };

  // Hàm xử lý khi click vào 1 hàng trong RoomList
  const handleSelectRoom = (user: User) => {
    setSelectedChatUser(user);
    setView('messages'); // Chuyển về view messages để xem nội dung
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
          }`}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isConnected ? 'Đang kết nối' : 'Ngoại tuyến'}
        </div>
      </div>
      {/* ... Header Section ... */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowTrainView(!showTrainView)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-950 transition-all shadow-md"
        >
          <Terminal size={20} />
          {showTrainView ? "Ẩn Bảng điều khiển" : "Bảng điều khiển huấn luyện AI"}
        </button>
        {/* ... Existing Add Message Button ... */}
      </div>

      {/* Real-time Training Logs */}
      {showTrainView && (
        <div className="mb-8 animate-in slide-in-from-top duration-300">
          <TrainView onStartTrain={handleStartTraining} isTraining={isTraining} />
        </div>
      )}

      {/* ... Rest of your Table and Pagination ... */}

      {/* Modal for Creating/Editing */}
      <MessageModal
        key={selectedMessage?.id || 'new-message'}
        isOpen={isModalOpen}
        initialData={selectedMessage}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* RENDER THE POPUP IF A USER IS SELECTED */}
      {selectedChatUser && (
        <AdminChatPopup
          targetUser={selectedChatUser}
          onClose={() => setSelectedChatUser(null)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Quản lý tin nhắn</h1>
          </div>
          <p className="text-sm text-emerald-900">Theo dõi và quản lý các cuộc hội thoại giữa người dùng và hệ thống.</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl w-full md:w-auto shadow-inner">
          <button
            onClick={() => setView('messages')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'messages' ? 'bg-white text-emerald-600 shadow-sm' : 'text-emerald-900 hover:text-slate-700'}`}
          >
            <List size={18} />
            Tất cả tin nhắn
          </button>
          <button
            onClick={() => setView('rooms')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'rooms' ? 'bg-white text-emerald-600 shadow-sm' : 'text-emerald-900 hover:text-slate-700'}`}
          >
            <LayoutGrid size={18} />
            Phòng chat
          </button>
        </div>

      </div>


      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {view === 'messages' ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm text-emerald-900 font-medium">Hộp thư: {messages.length} tin nhắn</span>
                </div>
              </div>
              <MessageTable
                messages={messages}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReply={handleReply} />
              {/* Pagination logic here */}
              {totalPages > 1 && (
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
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-4">Phòng chat đang hoạt động</h3>
              {/* Thay bằng Component RoomList thực tế của bạn */}
              <RoomList rooms={getRoomsFromMessages(messages)} onSelectRoom={handleSelectRoom} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagePage;
