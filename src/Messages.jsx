import { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageSquare,
  Smile,
  Send,
  Check,
  CheckCheck,
} from "lucide-react";
import Sidebar from "./SideBar";
import PropTypes from "prop-types";
import {
  getUsers,
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../services/api";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const ALLOWED_USER_TYPES = ["admin", "nurse", "nutritionist", "relative"];

  const filteredChats = chats
    .filter((chat) => {
      if (activeFilter === "all") return true;
      return chat.userType.toLowerCase() === activeFilter.toLowerCase();
    })
    .filter((chat) => {
      if (!searchQuery) return true;
      return (
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.userType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const MessageStatus = ({ isRead }) => {
    return (
      <div className="text-xs text-gray-500">
        {isRead ? (
          <CheckCheck className="h-3 w-3 text-cyan-500" />
        ) : (
          <Check className="h-3 w-3 text-gray-400" />
        )}
      </div>
    );
  };

  MessageStatus.propTypes = {
    isRead: PropTypes.bool.isRequired,
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chats and conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const [users, conversations] = await Promise.all([
          getUsers(),
          getConversations(),
        ]);

        console.log("API Response - Users:", users);
        console.log("API Response - Conversations:", conversations);
        console.log("Current user:", JSON.parse(localStorage.getItem("user")));

        console.log("Conversations data:", conversations);

        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData?._id) {
          throw new Error("No authenticated user found");
        }

        // Create a map of last messages from conversations
        const conversationsMap = conversations.reduce((acc, conv) => {
          console.log("Processing conversation:", conv);
          acc[conv.user._id] = {
            lastMessage: conv.lastMessage.content,
            time: new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unreadCount: conv.unreadCount,
          };
          return acc;
        }, {});

        console.log("Conversations map:", conversationsMap);

        const formattedChats = users
          .filter((user) => {
            const isAllowedType = ALLOWED_USER_TYPES.includes(
              user.userType.toLowerCase()
            );
            const isNotCurrentUser = user._id !== userData._id;
            return isAllowedType && isNotCurrentUser;
          })
          .map((user) => ({
            id: user._id,
            name: user.fullName,
            userType:
              user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
            avatar: user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
            online: false,
            lastMessage: conversationsMap[user._id]?.lastMessage || "",
            time: conversationsMap[user._id]?.time || "",
            unread: conversationsMap[user._id]?.unreadCount || 0,
          }));

        setChats(formattedChats);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load conversations");
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(fetchConversations, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;

      try {
        const messagesData = await getMessages(activeChat.id);
        const formattedMessages = messagesData.map((msg) => ({
          id: msg._id,
          sender: msg.senderId, // Since it's a string ID now, not a populated object
          content: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: msg.isRead,
          type:
            msg.senderId === JSON.parse(localStorage.getItem("user"))._id
              ? "sent"
              : "received",
        }));

        setMessages(formattedMessages);
        scrollToBottom();

        if (activeChat.unread > 0) {
          await markMessagesAsRead(activeChat.id);
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === activeChat.id ? { ...chat, unread: 0 } : chat
            )
          );
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 10000);
    return () => clearInterval(intervalId);
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const sentMessage = await sendMessage(activeChat.id, newMessage.trim());

      // Add new message to the list
      setMessages((prev) => [
        ...prev,
        {
          id: sentMessage._id,
          sender: "You",
          content: sentMessage.content,
          time: new Date(sentMessage.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: false,
          type: "sent",
        },
      ]);

      // Update last message in chat list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                lastMessage: newMessage.trim(),
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : chat
        )
      );

      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            {filteredChats.map((chat) => (
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
          ${message.type === "sent" ? "justify-end" : "justify-start"}`}
                    >
                      {message.time}
                      {message.type === "sent" && (
                        <MessageStatus isRead={message.isRead} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
