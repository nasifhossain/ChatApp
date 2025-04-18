import { useEffect, useState,useContext } from "react";
import axios from "axios";
import profile_alison from "../assets/profile_alison.png";
import profile_marco from "../assets/profile_marco.png";
import profile_martin from "../assets/profile_martin.png";
import avatar_icon from "../assets/avatar_icon.png";
import { ChatContext } from "../Context/ChatContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useFriendsData = (username) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {myFriends,setMyFriends} = useContext(ChatContext);
  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      axios.get(`${backendUrl}/conversation/${localStorage.getItem('_id')}`)
      .then((response) => {
        console.log(response.data);
        setData(response.data.conversationList);
        setMyFriends(response.data.conversationList);
      })
      .catch((error) => {
        setError(error);
      }).finally(() => {
        setLoading(false);
      });

    };

    fetchData();
  }, [username]);

  return { data, loading, error };
};

export default useFriendsData;
