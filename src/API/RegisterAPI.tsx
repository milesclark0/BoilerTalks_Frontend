import axios from "./axios";

export async function RegisterAccountAPI(firstName: string, lastName: string, username: string, password: string) {
  const data = { firstName, lastName, username, password };
  const res = await axios.post("/auth/register", data); 
  return res;
}

