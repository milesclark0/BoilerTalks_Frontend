import axios from "axios";
import { useAuth } from "../context/context";

const useRefreshToken = () => {
  const { setIsLoggedIn } = useAuth();

  const refreshToken = async () => {
    const response = await axios.get("http://127.0.0.1:5000/auth/refresh", {
      withCredentials: true,
    });
    if (response.status === 200) {
        //cookies should be set with new access token
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    return response.data.accessToken;
  };

  return refreshToken;
};

export default useRefreshToken; 
