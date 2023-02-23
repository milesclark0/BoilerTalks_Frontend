import axios from "./axios";

export async function ShowProfile(username: string) {
  console.log("running query...");
  const res = await axios.get("/profile/getProfile/$username}");
  console.log(res.data);
  return res;
}