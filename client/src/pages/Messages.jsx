import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000");

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const chatIdParam = searchParams.get("chatId");

  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Connections
  useEffect(() => {
    if (user) {
      fetchConnections();
    } else {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      const id = user._id || user.id;
      if (!id) { setLoading(false); return; }

      const res = await axios.get(`/api/connections?userId=${id}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setChatList(list);

      if (chatIdParam) {
        const target = list.find(c => c._id === chatIdParam);
        if (target) setActiveChat(target);
        else if (list.length > 0) setActiveChat(list[0]);
      } else if (list.length > 0) {
        setActiveChat(list[0]);
      }
    } catch (err) {
      console.error("Failed to fetch connections", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Messages & Join Room
  useEffect(() => {
    if (!activeChat || !user) return;

    const fetchMessages = async () => {
      try {
        const otherUserId = activeChat._id;
        const res = await axios.get(`/api/messages/${otherUserId}`);
        setMessages(res.data);

        const myId = user._id || user.id;
        const roomName = [myId, otherUserId].sort().join("-");
        socket.emit("join_room", roomName);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();

    const handleReceive = (newMessage) => {
      const myId = user._id || user.id;
      const otherUserId = activeChat._id;
      const isRelevant =
        (newMessage.sender._id === otherUserId) ||
        (newMessage.sender === otherUserId) ||
        (newMessage.sender._id === myId) ||
        (newMessage.sender === myId);

      if (isRelevant) {
        setMessages((prev) => {
          if (prev.some(m => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [activeChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;

    const recipientId = activeChat._id;
    const content = input;
    const tempMsg = {
      _id: Date.now().toString(),
      sender: { _id: user._id || user.id, name: user.name },
      content: content,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);
    setInput("");

    try {
      await axios.post("/api/messages/send", { recipientId, content });
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFDFC]">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Syncing encrypted chats...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#FDFDFC] overflow-hidden flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full pt-20 px-4 pb-4 gap-4 h-[calc(100vh-80px)]">

        {/* SIDEBAR */}
        <aside className="w-96 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden hidden md:flex">
          <div className="p-6 border-b border-slate-100 bg-[#F8FAFC]">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Chats</h2>
            <p className="text-xs text-slate-500 font-medium">{chatList.length} Active Conversations</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {chatList.length === 0 && (
              <div className="text-center p-8 opacity-50">
                <span className="text-4xl block mb-2">📭</span>
                <p className="text-sm">No conversations yet.</p>
              </div>
            )}

            {chatList.map((chat) => (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveChat(chat)}
                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 relative group ${activeChat?._id === chat._id
                    ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                    : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${activeChat?._id === chat._id ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                  }`}>
                  {chat.name ? chat.name[0] : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold truncate ${activeChat?._id === chat._id ? "text-white" : "text-slate-900"}`}>
                    {chat.name}
                  </h4>
                  <p className={`text-xs truncate ${activeChat?._id === chat._id ? "text-blue-100" : "text-slate-500"}`}>
                    {chat.role === 'lawyer' ? `⚖️ ${chat.specialization}` : `📍 ${chat.location}`}
                  </p>
                </div>
                {activeChat?._id === chat._id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </motion.div>
            ))}
          </div>
        </aside>

        {/* MAIN CHAT */}
        <section className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative">

          {activeChat ? (
            <>
              {/* CHAT HEADER */}
              <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                    {activeChat.name ? activeChat.name[0] : "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{activeChat.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-xs text-slate-500 font-medium">Online now</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const roomId = `nyay-${Date.now()}`;
                      const link = `${window.location.origin}/meet/${roomId}`;
                      window.open(link, "_blank");
                      setInput(`📞 Join Video Meeting: ${link}`);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="p-3 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
                    title="Start Video Call"
                  >
                    📹
                  </button>
                  <button className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition">
                    ℹ️
                  </button>
                </div>
              </header>

              {/* MESSAGES LIST */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-4xl mb-4">💬</div>
                    <p>Say hello to start the conversation!</p>
                  </div>
                )}

                {messages.map((msg, i) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isMe = senderId === (user._id || user.id);

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] px-6 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${isMe
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                        }`}>
                        {msg.content.includes("http") && msg.content.includes("meet/") ? (
                          <a href={msg.content.split(": ")[1]} target="_blank" rel="noreferrer" className="underline font-bold hover:text-blue-200">
                            {msg.content}
                          </a>
                        ) : (
                          msg.content
                        )}

                        <div className={`text-[10px] mt-2 opacity-70 text-right ${isMe ? "text-blue-100" : "text-slate-400"}`}>
                          {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={scrollRef}></div>
              </div>

              {/* INPUT AREA */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition">📎</button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium"
                  />
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition">😊</button>
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
                  >
                    <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </div>

            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 mb-6 animate-pulse-slow">
                <span className="text-6xl">👋</span>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Welcome to Secure Chat</h3>
              <p className="max-w-xs text-center">Select a conversation from the sidebar to start instant messaging.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
