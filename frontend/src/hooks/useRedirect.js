import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

// userauthstatus will be a string set to either loggedIn
// or loggedOut
export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        // This post request checks whether a user is logged in
        await axios.post("/dj-rest-auth/token/refresh/");
        // If a user is logged in, the code below will run
        // redirects to homepage
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (error) {
        // If a user is logged out, redirects to homepage
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};
