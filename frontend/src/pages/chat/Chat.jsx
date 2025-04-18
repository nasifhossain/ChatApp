import React, { useContext, useRef, useEffect } from "react";
import LeftBar from "../../components/LeftBar";
import ChatHistory from "../../components/ChatHistory";
import { ChatContext } from "../../Context/ChatContext";
import UserProfile from "../../components/UserProfile";

const Chat = () => {
  const { showLeftBar, showProfile, user, setShowProfile } =
    useContext(ChatContext);
  const modalRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile, setShowProfile]);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="lg:w-96 max-lg:hidden h-full overflow-y-auto bg-white">
        <LeftBar />
      </div>

      {/* Mobile view: LeftBar or ChatHistory */}
      {showLeftBar ? (
        <div className="w-full lg:hidden h-full overflow-y-auto bg-white">
          <LeftBar />
        </div>
      ) : (
        <div className="w-full lg:hidden h-full bg-gray-200 flex flex-col">
          <ChatHistory />
        </div>
      )}

      {/* Chat Area */}
      <div className="w-full max-lg:hidden h-full flex flex-col bg-gray-200">
        <ChatHistory />
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-slate-800 p-6 mx-4 rounded-xl text-white w-full max-w-md shadow-lg"
          >
            <UserProfile user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
