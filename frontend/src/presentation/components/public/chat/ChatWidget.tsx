'use client';

import { MessageSender } from '@/src/domain/entity/message-sender.enum';
import { Message } from '@/src/domain/entity/message.entity';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { AppProviders } from '@/src/provider/provider';
import { formatMessageTime, parseServerDate } from '@/src/shared/date.utils';
import { BookOpen, Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currUser } = useAuth();

  // 1. Fetch Chat History (Restored from your original)
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (currUser?.id && isOpen) {
        setIsFetchingHistory(true);
        try {
          const history = await AppProviders.GetMessagesByUserUseCase.execute(currUser.id);
          setMessages(history);
        } catch (error) {
          console.error("Failed to load chat history:", error);
        } finally {
          setIsFetchingHistory(false);
        }
      }
    };
    fetchChatHistory();
  }, [currUser?.id, isOpen]);

  // 2. Real-time WebSocket Logic
  useEffect(() => {
    if (!currUser?.id) return;

    const socket = new WebSocket('ws://localhost:8080/message');

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      try {
        const receivedMessage: Message = JSON.parse(event.data);

        if (receivedMessage.user?.id === currUser.id) {
          setMessages((prev) => {
            const receivedTime = parseServerDate(receivedMessage.createdAt);

            const existingIndex = prev.findIndex((m) => {
              // 1. Check by ID (If backend sends the tempId back)
              if (m.id === receivedMessage.id) return true;

              // 2. Fallback: Fuzzy match (If backend replaced tempId with MySQL ID)
              if (!m.createdAt || receivedTime === null) return false;
              const mTime = parseServerDate(m.createdAt);
              const timeDiff = Math.abs((mTime ?? 0) - receivedTime);

              return m.content.trim() === receivedMessage.content.trim() && timeDiff < 5000;
            });

            if (existingIndex !== -1) {
              return prev;
            }

            return [...prev, receivedMessage];
          });

          if (receivedMessage.sender !== MessageSender.USER) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    return () => socket.close();
  }, [currUser?.id]);

  // 3. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Use a high-precision timestamp as a temporary ID
    const tempId = Date.now();

    const userMsg: Message = {
      id: tempId, // Assign timestamp as temporary ID
      content: inputValue,
      sender: MessageSender.USER,
      createdAt: new Date().toISOString(),
      user: currUser!,
    };

    // Optimistic update
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // IMPORTANT: Your Backend/API must accept this 'id' 
      // and broadcast it back via WebSocket.
      await AppProviders.RequestMessageUseCase.execute(userMsg);
    } catch (error) {
      console.error("Chat error:", error);
      // Remove the optimistic message if sending fails
      setMessages((prev) => prev.filter(m => m.id !== tempId));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg relative">
                <Bot size={20} />
                {/* Visual Connection Indicator */}
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-emerald-600 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Hỗ trợ trực tuyến</h3>
                <p className="text-[10px] text-emerald-700 flex items-center gap-1">
                  {isConnected ? (
                    <><span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span> AI Assistant Online</>
                  ) : (
                    <><span className="h-1.5 w-1.5 bg-red-400 rounded-full"></span> Đang kết nối lại...</>
                  )}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-emerald-50">
            {isFetchingHistory ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 size={24} className="animate-spin text-emerald-900" />
                <p className="text-[10px] text-slate-400">Đang tải lịch sử...</p>
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="text-center py-10">
                    <Bot size={40} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-emerald-800 text-sm">Chào bạn! Tôi có thể giúp gì cho bạn?</p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === MessageSender.USER
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                      }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.relatedBook?.title && (
                        <Link
                          href={`/products/${msg.relatedBook.id}`}
                          className="mt-2 pt-2 border-t border-black/10 flex items-center gap-2 hover:opacity-80 transition-opacity group"
                        >
                          <BookOpen size={12} className="text-emerald-900 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold underline cursor-pointer text-emerald-600">
                            Xem sách: {msg.relatedBook.title}
                          </span>
                        </Link>
                      )}

                      <span className="text-[9px] mt-1 block opacity-60 text-right">
                        {formatMessageTime(msg.createdAt!)}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="w-full pl-4 pr-12 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !isConnected}
                className="absolute right-1.5 top-1.5 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-90"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 active:scale-90 flex items-center justify-center ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1'
          }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && !isConnected && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};
