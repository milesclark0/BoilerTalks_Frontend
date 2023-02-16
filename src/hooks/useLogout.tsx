import { LogoutAPI } from "../API/AuthAPI";
import { useAuth } from "../context/context";

const useLogout = () => {
  const { signOut } = useAuth();

  const logout = async () => {
    signOut();
    try {
      const response = await LogoutAPI();
      if (response.data.statusCode === 200) {
        console.log("logged out");
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};
export default useLogout;
