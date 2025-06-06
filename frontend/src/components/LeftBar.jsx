import React, { useContext, useState, useRef, useEffect } from "react";
import { FaSearch, FaEllipsisV, FaUserPlus, FaCheck } from "react-icons/fa";
import useFriendsData from "../Data/LeftBarData";
import logo_big from "../assets/logo_big.png";
import { ChatContext } from "../Context/ChatContext";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

const LeftBar = () => {
  const { data, loading, error } = useFriendsData("ron");
  const { setUser, showLeftBar, setShowLeftBar, myFriends, setMyFriends } =
    useContext(ChatContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [searchedFriend, setSearchedFriend] = useState(null);
  const [searchFriendText, setSearchFriendText] = useState("");
  const [addFriendText, setAddFriendText] = useState("");
  const [addFriendStatus, setAddFriendStatus] = useState(""); // 'success' or 'error'

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post(`${backendUrl}/conversation`, {
        senderId: localStorage.getItem("_id"),
        receiverId: friendId,
      });
      
      setAddFriendText(response.data.message);
      setAddFriendStatus("success");
      
      setTimeout(() => {
        setAddFriendText("");
        setAddFriendStatus("");
      }, 3000);
      
      setTimeout(() => {
        navigate(0);
      }, 3500);
      
    } catch (error) {
      setAddFriendText(error.response?.data?.message || "Failed to add friend");
      setAddFriendStatus("error");
      setTimeout(() => {
        setAddFriendText("");
        setAddFriendStatus("");
      }, 3000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowDropdown(false);
    window.location.href = '/login';
  };

  const handleSearchFriend = async (e) => {
    setSearchFriendText(e.target.value);
    try {
      const response = await axios.get(`${backendUrl}/user/${e.target.value}`);
      setSearchedFriend(response.data.userDetails);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-slate-900 p-2 gap-4 min-h-screen relative">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4 w-full relative">
        <div className="flex flex-row items-center gap-4">
          <img src={logo_big} alt="chat_icon" className="h-12" />
          <p className="text-lg font-bold text-white">Your Chats</p>
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddFriend(true)}
            className="text-white hover:text-green-400 transition text-lg"
            title="Add Friend"
          >
            <FaUserPlus />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-white hover:text-amber-400 transition"
            >
              <FaEllipsisV />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50">
                <button
                  onClick={handleEditProfile}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-100" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 rounded-md bg-slate-800 text-amber-100 border border-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Friends List */}
      <div className="flex flex-col items-start justify-start gap-4 w-full text-white overflow-y-auto">
        {myFriends?.map((item) => (
          <div className="w-full" key={item.id}>
            <div
              className="flex flex-row items-center justify-start gap-3 hover:bg-slate-800 p-2 rounded-md w-full hover:cursor-pointer"
              onClick={() => {
                setUser(item);
                setShowLeftBar(false);
              }}
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  item.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="text-md font-bold">{item.name}</p>
                <div className="flex items-center gap-1">
                  
                  <p className="text-md text-gray-400 truncate max-w-[120px]">
                    {item.lastMessage}
                  </p>
                </div>
              </div>
            </div>
            <hr className="w-full border-slate-700" />
          </div>
        ))}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-96 shadow-lg border border-amber-300 relative">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Search Friend
            </h2>

            {/* Status Message */}
            {addFriendText && (
              <div className={`mb-4 p-2 rounded-md text-sm flex items-center gap-2 ${
                addFriendStatus === 'success' 
                  ? 'bg-green-900/50 text-green-300 border border-green-500' 
                  : 'bg-red-900/50 text-red-300 border border-red-500'
              }`}>
                {addFriendStatus === 'success' && (
                  <FaCheck className="text-green-400" />
                )}
                {addFriendText}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter username..."
              value={searchFriendText}
              className="w-full p-2 rounded-md border border-amber-100 bg-slate-900 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              onChange={handleSearchFriend}
            />

            {/* Close Modal */}
            <button
              onClick={() => {
                setShowAddFriend(false);
                setSearchedFriend(null);
                setSearchFriendText("");
              }}
              className="absolute top-2 right-3 text-white hover:text-red-400 text-xl"
            >
              &times;
            </button>

            {/* Search Results */}
            {searchedFriend && searchedFriend.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 max-h-60 overflow-y-auto">
                {searchedFriend.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between bg-slate-700 rounded-md p-3 text-white"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.image}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold">{friend.name}</p>
                        <p className="text-sm text-amber-200">
                          @{friend.username}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(friend._id)}
                      className="text-green-400 hover:text-green-600 text-lg"
                      title="Add Friend"
                    >
                      <FaUserPlus />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftBar;