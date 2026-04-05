'use client';

import { MessageSender } from '@/src/domain/entity/message-sender.enum';
import { Message } from '@/src/domain/entity/message.entity';
import { User } from '@/src/domain/entity/user.entity';
import { AppProviders } from '@/src/provider/provider';
import { formatMessageTime } from '@/src/shared/date.utils';
import { Loader2, Send, User as UserIcon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AdminChatPopupProps {
  targetUser: User;
  onClose: () => void;
}

export const AdminChatPopup = ({ targetUser, onClose }: AdminChatPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch history for the SELECTED user (Initial Load)
  useEffect(() => {
    const fetchHistory = async () => {
      setIsFetching(true);
      try {
        const history = await AppProviders.GetMessagesByUserUseCase.execute(targetUser.id!);
        setMessages(history);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchHistory();
  }, [targetUser.id]);

  // 2. WebSocket Connection for Real-time updates
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/message');

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      try {
        const receivedMessage: Message = JSON.parse(event.data);

        // CRITICAL: Only add message if it belongs to the user we are currently chatting with
        if (receivedMessage.user?.id === targetUser.id) {
          setMessages((prev) => {
            const exists = prev.find((m) => m.content === receivedMessage.content && m.createdAt === receivedMessage.createdAt);
            if (exists) {
              return prev.map((m) => m.id === receivedMessage.id ? receivedMessage : m);
            }
            return [...prev, receivedMessage];
          });
        }
      } catch (error) {
        console.error("Error parsing real-time message:", error);
      }
    };

    return () => socket.close();
  }, [targetUser.id]);

  // 3. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const adminMsg: Message = {
      content: inputValue,
      sender: MessageSender.AI,
      createdAt: new Date().toISOString(),
      user: targetUser,
    };

    // We optimisticially update UI (WebSocket might also send this back depending on backend config)
    setInputValue('');
    setIsLoading(true);

    try {
      await AppProviders.CreateMessageUseCase.execute(adminMsg);
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <div className="w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right-5">

        {/* Header */}
        <div className="bg-slate-800 p-4 text-white flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-blue-500 p-2 rounded-full">
                <UserIcon size={18} />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-800 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{targetUser.fullName}</h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                {isConnected ? 'Live' : 'Disconnected'} • ID: #{targetUser.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 className="animate-spin text-blue-500" />
              <p className="text-xs text-slate-400 font-medium">Syncing history...</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === MessageSender.AI ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm transition-all ${msg.sender === MessageSender.AI
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[9px] mt-1.5 block opacity-60 text-right font-medium">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 shadow-md shadow-blue-200"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};