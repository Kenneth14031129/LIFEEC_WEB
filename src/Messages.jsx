import { useState } from "react";
import {
  Search,
  MessageSquare,
  Smile,
  Send,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";
import Sidebar from "./SideBar";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Sample data for chats
  const chats = [
    {
      id: 1,
      name: "Kenneth Gaviola",
      userType: "Nurse",
      avatar: "KG",
      online: true,
      lastMessage: "Patient report has been updated",
      time: "2 min ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Mycko Par",
      userType: "Nurse",
      avatar: "MP",
      online: false,
      lastMessage: "Medication schedule for Room 101",
      time: "1 hour ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Ronn Adia",
      userType: "Nutritionist",
      avatar: "RA",
      online: true,
      lastMessage: "Activity schedule for tomorrow",
      time: "3 hours ago",
      unread: 1,
    },
    {
      id: 4,
      name: "JC Castillo",
      userType: "Relative",
      avatar: "JC",
      online: false,
      lastMessage: "Thank you for the update",
      time: "5 hours ago",
      unread: 0,
    },
  ];

  // Sample messages for active chat
  const messages = [
    {
      id: 1,
      sender: "Kenneth Gaviola",
      content: "Good morning! I've just completed my rounds.",
      time: "9:00 AM",
      status: "read",
      type: "received",
    },
    {
      id: 2,
      sender: "You",
      content: "Thanks for the update. How are the patients in Ward A?",
      time: "9:05 AM",
      status: "read",
      type: "sent",
    },
    {
      id: 3,
      sender: "Kenneth Gaviola",
      content: "All stable. Mr. Johnson's blood pressure has improved.",
      time: "9:10 AM",
      status: "read",
      type: "received",
    },
    {
      id: 4,
      sender: "You",
      content: "That's great news! I'll update his chart.",
      time: "9:12 AM",
      status: "sent",
      type: "sent",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const MessageStatus = ({ status }) => {
    if (status === "sent") return <Clock className="h-3 w-3 text-gray-400" />;
    if (status === "delivered")
      return <Check className="h-3 w-3 text-gray-400" />;
    if (status === "read")
      return <CheckCheck className="h-3 w-3 text-cyan-500" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activePage="messages" />

      <div className="ml-72 flex h-screen">
        {/* Chat List Sidebar */}
        <div className="w-96 border-r border-gray-200 bg-white/80 backdrop-blur-xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4">
              Messages
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl">
              {[
                { id: "all", label: "All" },
                { id: "Nurse", label: "Nurses" },
                { id: "Nutritionist", label: "Nutritionists" },
                { id: "Relative", label: "Relatives" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.id
                      ? "bg-white text-cyan-500 shadow-sm"
                      : "text-gray-600 hover:bg-white/50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-[calc(100vh-13rem)]">
            {chats
              .filter(
                (chat) =>
                  activeFilter === "all" || chat.userType === activeFilter
              )
              .map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100
                    ${activeChat?.id === chat.id ? "bg-blue-50/50" : ""}`}
                >
                  <div className="relative">
                    <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {chat.name}{" "}
                        <span className="font-normal text-gray-500">
                          ({chat.userType})
                        </span>
                      </h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-white/70">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {activeChat.avatar}
                    </div>
                    {activeChat.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeChat.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {activeChat.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4"></div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "sent" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.type === "sent" ? "order-2" : ""
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 ${
                        message.type === "sent"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs text-gray-500 
                      ${
                        message.type === "sent"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.time}
                      {message.type === "sent" && (
                        <MessageStatus status={message.status} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white/90 backdrop-blur-xl">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-4"
              >
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Smile className="h-6 w-6" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No chat selected
              </h3>
              <p className="text-gray-500 mt-1">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
