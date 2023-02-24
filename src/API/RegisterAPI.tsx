import axios from "./axios";

export async function RegisterAccountAPI(firstName: string, lastName: string, username: string, password: string, email: string) {
  const data = { firstName, lastName, username, password, email};
  const res = await axios.post("/auth/register", data); 
  return res;
}

export async function ChangePasswordAPI(username: string, password: string) {
  const data = {username, password};
  const res = await axios.post("/auth/changePassword", data); 
  console.log(res);
  return res;
}
