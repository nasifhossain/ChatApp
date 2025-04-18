import React, { useContext, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { FaArrowLeft, FaBan } from "react-icons/fa"; // 🚫 Block icon
import { CgClose } from "react-icons/cg"

const UserProfile = ({ user }) => {
  const { setShowProfile } = useContext(ChatContext);
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);

  const handleBlock = () => {
    setShowConfirmBlock(false);
    // TODO: Backend logic or context update
    console.log(`User ${user.name} blocked`);
    setShowProfile(false);
  };

  return (
    <div className="relative m-2">
      {/* Close Button */}
      <button
        onClick={() => setShowProfile(false)}
        className="absolute top-0 right-0 text-white hover:text-red-500"
      >
        <CgClose size={18} />
      </button>

      <div className="flex flex-col items-center gap-3 mt-6">
        <img
          src={user.image}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-amber-400"
        />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-green-400">Online</p>
        <p className="text-sm text-gray-300">More details here...</p>

        {/* 🚫 Block User Button with Icon */}
        <button
          onClick={() => setShowConfirmBlock(true)}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 transition"
        >
          <FaBan />
          Block User
        </button>
      </div>

      {/* ⚠️ Confirm Block Modal */}
      {showConfirmBlock && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-xl text-white w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Block</h3>
            <p className="text-sm text-gray-300 mb-4">
              Are you sure you want to block <span className="font-bold">{user.name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmBlock(false)}
                className="px-4 py-1 rounded bg-gray-600 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                className="px-4 py-1 rounded text-red-500 bg-gray-400 hover:bg-gray-500"
              >
                Block User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
