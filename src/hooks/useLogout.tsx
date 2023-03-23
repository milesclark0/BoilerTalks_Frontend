import { LogoutAPI } from "../API/AuthAPI";
import { useAuth } from "../context/context";
import { Room } from "../types/types";
import useSockets from "./useSockets";

const useLogout = () => {
  const { signOut } = useAuth();
  const { disconnectFromRoom } = useSockets();

  const logout = async (currentRoom: Room) => {
    signOut();
    try {
      const response = await LogoutAPI();
      if (response.data.statusCode === 200) {
        console.log("logged out");
        disconnectFromRoom(currentRoom);
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
