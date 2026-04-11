'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, X, User as UserIcon, BookOpen, ShieldCheck } from 'lucide-react';
import { Message } from '@/src/domain/entity/message.entity';
import { MessageSender } from '@/src/domain/entity/message-sender.enum';
import { AppProviders } from '@/src/provider/provider';
import { Book } from '@/src/domain/entity/book.entity';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: Message) => void;
  initialData?: Message | null;
}

const EmptyMessage: Partial<Message> = {
  content: '',
  sender: MessageSender.USER,
  user: null,
  relatedBook: null,
};

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Message>>(EmptyMessage);
  const isReply = initialData && initialData.sender === MessageSender.USER;
  const [books, setBooks] = useState<Book[]>([]);


  // 1. Fetch danh sách sách khi mở modal
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const result = await AppProviders.GetAllBooksUseCase.execute(); // Lấy 100 cuốn sách đầu tiên
        setBooks(result);
      } catch (error) {
        console.error("Failed to load books:", error);
      }
    };

    if (isOpen) {
      fetchBooks();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        if (isReply) {
          // Nếu là Reply: Giữ nguyên user và book, nhưng đổi sender thành SYSTEM và xóa content cũ
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFormData({
            ...initialData,
            id: undefined, // Message mới
            content: '',   // Nội dung phản hồi mới
            sender: MessageSender.AI, // Mặc định là AI/System khi admin rep
            createdAt: new Date().toISOString()
          });
        } else {
          setFormData(initialData);
        }
      } else {
        setFormData(EmptyMessage);
      }
    }
  }, [initialData, isOpen, isReply]);

  const handleBookChange = (bookId: string) => {
    if (bookId === "") {
      setFormData({ ...formData, relatedBook: null });
    } else {
      const selectedBook = books.find(b => b.id?.toString() === bookId);
      setFormData({ ...formData, relatedBook: selectedBook || null });
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData as Message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-950">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-800">
              {isReply ? `Replying to ${initialData?.user?.fullName}` : initialData ? 'Edit Message Log' : 'Create Message'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-emerald-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">

            {/* Sender Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-400" /> Sender Role
              </label>
              <div className="flex gap-4">
                {['User', 'Ai'].map((role, index) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="sender"
                      value={index}
                      checked={formData.sender === index}
                      onChange={(e) => setFormData({ ...formData, sender: Number(e.target.value) as unknown as MessageSender })}
                      className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                    />
                    <span className={`text-sm font-medium ${formData.sender === index ? 'text-emerald-600' : 'text-emerald-800'}`}>
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* User Reference (Display only or simple input) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <UserIcon size={16} className="text-slate-400" /> User Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-emerald-50 border border-slate-200 rounded-lg outline-none text-slate-600 italic cursor-not-allowed"
                  value={formData.user?.fullName || 'Anonymous User'}
                  readOnly
                  placeholder="Linked user..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-slate-400" /> Related Book
                </label>
                <select
                  className={`w-full px-4 py-2 border border-slate-200 rounded-lg outline-none text-sm transition-all focus:ring-2 focus:ring-emerald-500 bg-white}`}
                  value={formData.relatedBook?.id || ""}
                  onChange={(e) => handleBookChange(e.target.value)}
                >
                  <option value="">-- No Book Linked --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
                {isReply && (
                  <p className="text-[10px] text-emerald-900 mt-1">Book context is locked during reply.</p>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Message Content</label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all placeholder:text-slate-300"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Type the message content here..."
              />
              <p className="text-[11px] text-slate-400">
                Note: Editing historical messages should only be done for data correction purposes.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              {isReply ? 'Send Reply' : initialData ? 'Update Record' : 'Create Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
