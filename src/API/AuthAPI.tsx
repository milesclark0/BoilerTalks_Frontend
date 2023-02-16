import axios from "./axios";
export const LoginAPI = async (username: string, password: string) => {
  var credentials = btoa(username + ":" + password);
  const res = await axios.post("/auth/login", null, {
    headers: {
      Authorization: "Basic " + credentials,
    },
  });
  return res;
};

export const LogoutAPI = async () => {
  const res = await axios.get("auth/logout", {
    withCredentials: true,
  });
  return res;
};
