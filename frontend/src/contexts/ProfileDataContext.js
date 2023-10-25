import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });
  const currentUser = useCurrentUser();

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        // Retrieves the id of the profile the user clicked
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        // This updates the followers and following count on the
        // profile page
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            // followHelper is a function imported from utils that
            // updates followers and following count
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        // This allows users to follow profiles on the popular
        // profiles tab on the right
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (error) {
      // console.log(error);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);
      setProfileData((prevState) => ({
        ...prevState,
        // This updates the followers and following count on the
        // profile page
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            // followHelper is a function imported from utils that
            // updates followers and following count
            unfollowHelper(profile, clickedProfile)
          ),
        },
        // This allows users to follow profiles on the popular
        // profiles tab on the right
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (error) {
      // console.log(error);
    }
  };

  //   Fetches popular profiles data on mount
  useEffect(() => {
    const handleMount = async () => {
      try {
        // Makes a request to the profiles endpoint
        const { data } = await axiosReq.get(
          // Fetching them in descending order of however
          // many followers they have
          `/profiles/?ordering=-followers_count`
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (error) {
        // console.log(error);
      }
    };
    handleMount();
    // Refetches popular profiles data depending on each
    // current user's profiles they are following
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
