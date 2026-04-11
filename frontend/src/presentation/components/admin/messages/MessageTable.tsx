'use client';

import React from 'react';
import { Edit, Trash2, Mail, MessageSquare, BookOpen, Calendar, User as UserIcon, Reply } from 'lucide-react';
import { Message } from '@/src/domain/entity/message.entity'; // Adjust path as needed
import { MessageSender } from '@/src/domain/entity/message-sender.enum';

interface MessageTableProps {
  messages: Message[];
  onEdit: (message: Message) => void;
  onReply: (message: Message) => void;
  onDelete: (id: number) => void;
}

const MessageTable: React.FC<MessageTableProps> = ({ messages, onEdit, onReply, onDelete }) => {

  // Helper to format dates consistently
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString();
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Sender & User</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Content</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Related Context</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Sent At</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-800 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {messages.map((msg) => (
            <tr key={msg.id} className="hover:bg-emerald-50 transition-colors">

              {/* Sender Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${msg.sender === MessageSender.USER // Adjust based on your MessageSender enum values
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      : 'bg-purple-50 border-purple-100 text-purple-600'
                    }`}>
                    <UserIcon size={20} />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-bold text-slate-950">
                      {msg.user?.fullName || 'Anonymous'}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                      {msg.sender}
                    </div>
                  </div>
                </div>
              </td>

              {/* Message Content */}
              <td className="px-6 py-4">
                <div className="flex items-start gap-2 max-w-xs md:max-w-md">
                  <MessageSquare size={14} className="text-slate-300 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {msg.content}
                  </p>
                </div>
              </td>

              {/* Related Book Context */}
              <td className="px-6 py-4 whitespace-nowrap">
                {msg.relatedBook ? (
                  <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded-md w-fit">
                    <BookOpen size={14} className="text-emerald-800" />
                    <span className="truncate max-w-[120px]">{msg.relatedBook.title}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">General Inquiry</span>
                )}
              </td>

              {/* Timestamp */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(msg.createdAt)}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  {msg.sender === MessageSender.USER && (
                    <button
                      onClick={() => onReply(msg)} // Thêm prop onReply vào Table
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg title='Reply User'"
                    >
                      <Reply size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(msg)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
                    title="Edit Message"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => msg.id && onDelete(msg.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                    disabled={!msg.id}
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {messages.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-emerald-800 italic">
                <div className="flex flex-col items-center gap-2">
                  <Mail size={32} className="text-slate-200" />
                  <p>No messages found in the database.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MessageTable;
