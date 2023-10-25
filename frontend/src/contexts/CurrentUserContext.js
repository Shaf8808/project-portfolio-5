import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

// Create context function for variable and callback function
export const CurrentUserContext = createContext();
// Evertime the setcurrent user function is called, a new context object is created
export const SetCurentUserContext = createContext();

// Use context functions for variable and callback function
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurentUserContext);

export const CurrentUserProvider = ({ children }) => {
  // [Variable, callback function]
  const [currentUser, setCurentUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      // Callback function
      setCurentUser(data);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
    // Pass it an empty array to only run function once
  }, []);

  useMemo(() => {
    // Always refreshes access token before making a request
    axiosReq.interceptors.response.use(
      async (config) => {
        if (shouldRefreshToken()) {
          // Refreshes token before sending the request
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            // If refreshing token fails, it means token has expired
            // Redirects to sign in page and sets currentUser to null
          } catch (err) {
            setCurentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();
            return config;
          }
        }
        return config;
      },
      // If there is an error, rejects the promise with the error
      (err) => {
        return Promise.reject(err);
      }
    );
    // Interceptor function that allows a user to stay logged in
    // for 24 hours
    axiosRes.interceptors.response.use(
      // If there is no error, returns the response
      (response) => response,
      // If there is an error, checks if it is a 401 error
      async (err) => {
        if (err.response?.status === 401) {
          // Refreshes token if it is a 401
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            // If refreshing the token fails, redirects user to sign-in page
            // by using useHistory hook imported above
          } catch (err) {
            setCurentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();
          }
          // Exits the interceptor if there is no error after refreshing
          // token
          return axios(err.config);
        }
        // If the error wasn't 401, rejects promise with the error
        // and exits interceptor
        return Promise.reject(err);
      }
    );
  }, [history]);

  return (
    // Provider for variable currentUser
    <CurrentUserContext.Provider value={currentUser}>
      {/* Provider for callback function setCurentUser */}
      <SetCurentUserContext.Provider value={setCurentUser}>
        {children}
      </SetCurentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
