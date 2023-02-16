import axios from "../API/axios";
import { useAuth } from "../context/context";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setIsLoggedIn, signIn,  } = useAuth();
  const logout = useLogout();

  const refreshToken = async () => {
    const response = await axios.get("auth/refresh", {
      withCredentials: true,
    });
    if (response.data.statusCode === 200) {
      //token refreshed
      signIn({ username: response.data.data.username });
    } else {
      //token expired
      logout();
    }
    return response.data.accessToken;
  };

  return refreshToken;
};

export default useRefreshToken; 
