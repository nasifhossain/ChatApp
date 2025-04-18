import axios from "axios";
import { useState, useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useUserDetails = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/details`, {
          headers: {
            Authorization: `${token}`  // ✅ Send token in header
          }
        });
        setUser(response.data.user);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDetails();
  }, [token]);

  return { user, loading, error };
};

export default useUserDetails;
