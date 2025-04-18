import React, { useContext, useState, useEffect, useRef } from "react";
import send_button from "../assets/send_button.png";
import { ChatContext } from "../Context/ChatContext";
import { FaArrowLeft } from "react-icons/fa";
import useChatData from "../Data/ChatData";
import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL;
const ChatHistory = () => {
  const {
    chat,
    user,
    setUser,
    showChat,
    setShowChat,
    showLeftBar,
    setShowLeftBar,
    showProfile,
    setShowProfile,
    socket,
  } = useContext(ChatContext);
  const [currentMessage, setCurrentMessage] = useState("");
  console.log(user);

  const bottomRef = useRef(null);

  //console.log('user : ',user);
  const { messages, loading, error } = useChatData({user,setUser,conversationId:user?.id});
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  console.log(user?.id);
  if (!user) {
    return <div>No user selected</div>;
  }
  console.log("messages : ", messages);
  console.log("user : ", user);
  const handleBack = () => {
    setShowChat(false);
    setShowLeftBar(true);
    setShowProfile(false);
  };
  const handleSendMessage = () => {
    setCurrentMessage(currentMessage);
    if (socket) {
      socket.emit("sendMessage", {
        conversationId: user.id,
        senderId: localStorage.getItem("_id"),
        message: currentMessage,
        receiverId: user.receiverId,
      });
    }
    axios
      .post(`${backend_url}/message`, {
        conversationId: user.id,
        senderId: localStorage.getItem("_id"),
        message: currentMessage,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setUser({...user,lastMessage:currentMessage});
        console.log('Hello ',user.lastMessage);
        setCurrentMessage("");
        
      });

      setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
  };

  return (
    <div className="flex flex-col justify-between bg-slate-800 text-white w-full min-h-full relative">
      {/* 🧑 Top Chat Header */}
      <div className="flex items-center justify-start gap-3 bg-slate-900 p-1 px-3 border-b border-slate-700 shadow mb-1">
        <button
          onClick={handleBack}
          className="text-white lg:hidden hover:text-amber-400 transition"
        >
          <FaArrowLeft size={20} />
        </button>
        <img
          src={user.image}
          alt={user.name}
          className="w-10 h-10 rounded-full hover:cursor-pointer border-2 border-amber-400"
          onClick={() => setShowProfile(true)}
        />
        <div
          className="flex flex-col hover:cursor-pointer"
          onClick={() => setShowProfile(true)}
        >
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>

      {/* 💬 Messages Section */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full mb-20 px-2">
        {messages && messages.length > 0 ? (
          messages.map((message) =>
            message.sender._id === user.receiverId ? (
              <div key={message._id} className="flex justify-start mb-2">
                <div className="bg-blue-500 text-white rounded-b-lg rounded-tr-md py-2 px-4 max-w-xs md:max-w-md">
                  <p className="break-words">{message.message}</p>
                </div>
              </div>
            ) : (
              <div key={message._id} className="flex justify-end mb-2">
                <div className="bg-blue-600 text-white rounded-b-lg rounded-tl-md py-2 px-4 max-w-xs md:max-w-md">
                  <p className="break-words">{message.message}</p>
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-gray-400 text-center mt-3">No messages yet</p>
        )}
        {/* Auto-scroll target */}
        <div ref={bottomRef} />
      </div>

      {/* ⌨️ Sticky Bottom Input */}
      <div className="absolute bottom-4 left-4 right-4 rounded-md bg-slate-700 gap-2 border border-slate-600 px-2 py-2 flex flex-row items-center">
        <textarea
          placeholder="Type a message..."
          rows={1}
          className="flex-grow max-h-48 resize-none bg-transparent text-white focus:outline-none overflow-hidden custom-scroll"
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
            e.target.style.height = "auto"; // reset height
            e.target.style.height = `${e.target.scrollHeight}px`; // adjust height
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        <button className="rounded-md hover:bg-slate-600 transition self-end pb-1">
          <img
            src={send_button}
            onClick={handleSendMessage}
            alt="send_button"
            className="w-7"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;
