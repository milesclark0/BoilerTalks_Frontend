export async function RegisterInfo(firstName: string, lastName: string, username: string, password: string) {
  var auth = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  var jsonData = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
  };
  const res = await fetch("http://127.0.0.1:5000/auth/register", {
    method: "POST",
    headers: auth,
    body: JSON.stringify(jsonData),
  });
  return res;
}

export async function RegisterCourse() {
  const res = await fetch("http://127.0.0.1:5000/auth/register", {
    method: "GET",
  });
  return res;
}

export async function RegisterAccount(userInfo: { [key: string]: string }, userCourses: string[]) {
  var auth = { Accept: "application/json", "Content-Type": "application/json" };
  const jsonData = { info: userInfo, courses: userCourses };
  const res = await fetch("http://127.0.0.1:5000/auth/register", {
    method: "POST",
    headers: auth,
    body: JSON.stringify(jsonData),
  });
  return res;
}
