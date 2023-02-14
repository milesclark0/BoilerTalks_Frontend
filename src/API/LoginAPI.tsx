export const LoginAPI = async (username: string, password: string) => {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}`, Accept: "application/json", "Content-Type": "application/json" };
  const res = await fetch("http://127.0.0.1:5000/auth/login", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ username: username, password: password }),
  })
  return res;
};
