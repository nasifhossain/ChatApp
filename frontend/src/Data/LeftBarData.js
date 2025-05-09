import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ChatContext } from "../Context/ChatContext";

const useFriendsData = (username) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setMyFriends, socket } = useContext(ChatContext);
  useEffect(() => {
    if(!socket || !data) return;
   data.forEach(friend => {
      socket.emit("checkStatus", {
        targetUserId: friend.receiverId,
        requesterId: localStorage.getItem("_id")
      });
    });
  },[socket,data]);

  useEffect(() => {
    if(!socket) return;
    const handleStatusUpdate = (statusData) => {
      setData(prev => prev.map(user => 
        user.receiverId === statusData.userId 
          ? { ...user, status: statusData.status } 
          : user
      ));
      setMyFriends(prev => prev.map(user => 
        user.receiverId === statusData.userId 
          ? { ...user, status: statusData.status } 
          : user
      ));
    };
    socket.on("checkStatus", handleStatusUpdate);
  },[data,socket]); 

  useEffect(() => {
    

    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/conversation/${localStorage.getItem("_id")}`
        );

        if (response?.data?.conversationList) {
          // Initialize with default status
          const friendsWithStatus = response.data.conversationList.map(friend => ({
            ...friend,
            status: "Offline"
          }));

          setData(friendsWithStatus);
          setMyFriends(friendsWithStatus);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [username, socket, setMyFriends]);

  return { data, loading, error };
};

export default useFriendsData;