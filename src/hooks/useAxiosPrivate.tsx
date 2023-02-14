import { axiosPrivate } from "../API/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../context/context";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { setIsLoggedIn } = useAuth();

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        config.headers["X-CSRF-TOKEN"] = getCookie("csrf_access_token");
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        if (error?.response?.status === 401 && !originalRequest?.sent) {
          console.log("refreshing token");
          originalRequest.sent = true;
          const newAccessToken = await refresh();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(originalRequest);
        }
        // if something else went wrong
        return Promise.reject(error);
      }
    );
    //cleanup
    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
      axiosPrivate.interceptors.request.eject(requestInterceptor);
    };
  }, [refresh, setIsLoggedIn]);

  return axiosPrivate;
};

export default useAxiosPrivate;
