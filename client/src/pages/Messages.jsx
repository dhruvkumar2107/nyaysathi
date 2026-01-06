import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/* ---------------------------------------
   CHAT CONTACTS (Ideally fetched from /api/lawyers)
--------------------------------------- */
const CONTACTS = [
  {
    id: 1,
    name: "Adv. Rahul Sharma",
    role: "lawyer",
    specialization: "Criminal Law"
  },
  {
    id: 2,
    name: "Adv. Neha Verma",
    role: "lawyer",
    specialization: "Corporate Law"
  },
  {
    id: 3,
    name: "Adv. Ankit Patel",
    role: "lawyer",
    specialization: "Family Law"
  }
];

export default function Messages() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  /* 1. FETCH MESSAGES */
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/messages", {
        params: { lawyer: activeChat.name }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  /* 2. INITIAL LOAD & POLLING */
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [activeChat]);

  /* 3. AUTO SCROLL */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 4. SEND MESSAGE */
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Optimistic Update
    const tempMsg = {
      sender: user?.role === 'lawyer' ? 'lawyer' : 'client',
      text: input,
      lawyerName: activeChat.name
    };
    setMessages([...messages, tempMsg]);
    setInput("");

    try {
      await axios.post("/api/messages", tempMsg);
      fetchMessages(); // Sync with server
    } catch (err) {
      console.error("Send failed", err);
      // alert("Failed to send");
    }
  };

  const myRole = user?.role === 'lawyer' ? 'lawyer' : 'client';

  return (
    <main className="min-h-screen bg-white text-gray-900 flex pt-24 pb-4 px-4 h-screen">
      <div className="flex-1 max-w-[1128px] mx-auto flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* SIDEBAR */}
        <aside className="w-80 border-r border-gray-200 p-4 bg-gray-50 flex flex-col hidden md:flex">
          <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">
            Messages
          </h2>

          <div className="space-y-2 overflow-y-auto">
            {CONTACTS.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 rounded-xl cursor-pointer transition flex flex-col gap-1 ${activeChat.id === chat.id
                  ? "bg-blue-50 border border-blue-100 shadow-sm"
                  : "hover:bg-gray-100 border border-transparent"
                  }`}
              >
                <p className={`font-semibold ${activeChat.id === chat.id ? "text-blue-700" : "text-gray-900"}`}>{chat.name}</p>
                <p className="text-xs text-gray-500">
                  {chat.specialization}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT AREA */}
        <section className="flex-1 flex flex-col bg-white">
          {/* HEADER */}
          <header className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">{activeChat.name[0]}</div>
              {activeChat.name}
            </h3>
          </header>

          {/* MESSAGES */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                No messages yet. Start the conversation!
              </div>
            )}

            {messages.map((msg, i) => {
              const isMe = msg.sender === myRole;
              return (
                <div
                  key={i}
                  className={`max-w-md px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe
                      ? "bg-blue-600 text-white ml-auto rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                >
                  {msg.text}
                </div>
              );
            })}
            <div ref={scrollRef}></div>

            {/* UNIQUE AI ASSIST */}
            {user?.plan !== "silver" && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800 shadow-sm mx-auto max-w-lg mt-8">
                💡 <strong>AI Legal Assist:</strong>
                You may want to ask about applicable IPC sections or
                jurisdiction.
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-200"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
