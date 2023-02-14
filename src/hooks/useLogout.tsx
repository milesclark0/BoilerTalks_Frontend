import { LogoutAPI } from "../API/AuthAPI";
import { useAuth } from "../context/context";

const useLogout = () => {
  const { signOut } = useAuth();

  const logout = async () => {
    signOut();
    try {
      console.log("logging out");

      const response = await LogoutAPI();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};
export default useLogout;
