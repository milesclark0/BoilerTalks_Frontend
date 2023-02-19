import axios from "../API/axios";
import { useAuth } from "../context/context";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setIsLoggedIn, signIn } = useAuth();
  const logout = useLogout();

  const refreshToken = async () => {
    try {
      const response = await axios.get("auth/refresh", {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        //token refreshed
        console.log(response);

        signIn(response.data.data.user);
      } else {
        //something went wrong
        console.log(response.data.message);
        logout();
      }
      return response.data.accessToken;
    } catch (error) {
      //401: token expired or no token found
      logout();
    }
  };
  return refreshToken;
};

export default useRefreshToken;
