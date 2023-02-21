import { createContext, useContext } from "react";
import { useState } from "react";
import { User } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

type AuthProviderType = {
  user: User | undefined;
  signIn: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  signOut: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthProviderType>({
  user: undefined,
  signIn: (user: User) => {},
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
  signOut: () => {},
  setUser: (user: User) => {},
});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";
  const [user, setUser] = useState<User>({
    username: Cookies.get("user"),
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    _id: { $oid: "" },
    profilePicture: "",
    courses: [],
    activeCourses: [],
    blockedUsers: [],
    creationDate: { $date: "" },
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signOut = () => {
    setUser(undefined);
    setIsLoggedIn(false);
    Cookies.remove("user");
    navigate("/login", { state: { from: location }, replace: true });
  };

  const signIn = (user: User) => {
    setUser(user);
    setIsLoggedIn(true);
    Cookies.set("user", user?.username);
    console.log("signed in: navigate to", from.pathname);
    if (from.pathname === "/login" || from.pathname === "/register" || from.pathname === "/forgotPassword" || from.pathname === "/policies") {
      navigate("/home", { replace: true });
      return;
    }
    navigate(from, { replace: true });
  };

  return <AuthContext.Provider value={{ user, signIn, isLoggedIn, setIsLoggedIn, signOut, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
