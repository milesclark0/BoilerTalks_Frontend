import { createContext, useContext } from "react";
import { useState } from "react";
import { Profile, User } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

type AuthProviderType = {
  user: User | undefined;
  profile: Profile | undefined;
  signIn: (user: User, profile: Profile) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  signOut: () => void;
  setUser: (user: User) => void;
  setProfile: (profile: Profile) => void;
};

const AuthContext = createContext<AuthProviderType>({
  user: undefined,
  signIn: (user: User, profile: Profile) => {},
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
  signOut: () => {},
  setUser: (user: User) => {},
  profile: undefined,
  setProfile: (profile: Profile) => {},
});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";
  const [user, setUser] = useState<User>(undefined);
  const [profile, setProfile] = useState<Profile>(undefined);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signOut = () => {
    setUser(undefined);
    setIsLoggedIn(false);
    Cookies.remove("user");
    navigate("/login", { state: { from: location }, replace: true });
  };

  const signIn = (user: User, profile: Profile) => {
    setUser(user);
    setProfile(profile);
    setIsLoggedIn(true);
    Cookies.set("user", user?.username);
    console.log("signed in: navigate to", from.pathname);
    if (from.pathname === "/login" || from.pathname === "/register" || from.pathname === "/forgotPassword" || from.pathname === "/policies") {
      navigate("/home", { replace: true });
      return;
    }
    navigate(from, { replace: true });
  };

  return <AuthContext.Provider value={{ user, signIn, isLoggedIn, setIsLoggedIn, signOut, setUser, profile, setProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
