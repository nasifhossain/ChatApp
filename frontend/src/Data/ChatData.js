import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ChatContext } from "../Context/ChatContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useChatData = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket, myFriends, setMyFriends } = useContext(ChatContext);

  // Handle incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage?.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
        console.log("newMessage : ", newMessage);
        setMyFriends((prevFriends) =>
          prevFriends?.map((friend) =>
            friend.id === conversationId
              ? { ...friend, lastMessage: newMessage.message }
              : friend
          )
        );
        return;
      }
      const findConversation = myFriends?.find(
        (friend) => friend.id === newMessage.conversationId
      );
      if (findConversation) {
        setMyFriends((prevFriends) =>
          prevFriends?.map((friend) =>
            friend.id === findConversation.id
              ? { ...friend, lastMessage: newMessage.message }
              : friend
          )
        );
      }
    };

    socket.on("getMessage", handleNewMessage);
    return () => socket.off("getMessage", handleNewMessage);
  }, [socket, conversationId, setMyFriends]);

  // Fetch message history
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/message/${conversationId}`
        );
        const fetchedMessages = response.data.messageUserData || [];

        setMessages(fetchedMessages);

        // Update lastMessage in friends list based on latest message
        if (fetchedMessages.length > 0) {
          const latestMessage =
            fetchedMessages[fetchedMessages.length - 1].message;
          setMyFriends((prevFriends) =>
            prevFriends?.map((friend) =>
              friend.id === conversationId
                ? { ...friend, lastMessage: latestMessage }
                : friend
            )
          );
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  return { messages, loading, error };
};

export default useChatData;
