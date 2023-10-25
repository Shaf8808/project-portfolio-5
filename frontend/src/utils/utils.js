import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

// resource and setResource could be posts and setPosts or
// comments and setComments
// Function used to append new data for components like
// infinite scroll
export const fetchMoreData = async (resource, setResource) => {
  try {
    // Network request to the url of the next page of posts
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      // Spreads prevResource, which are previous posts
      ...prevResource,
      //   Updates next attribute with the url to the next page of results
      next: data.next,
      //   Used reduce method to loop through the new page of results
      // we got from the api
      results: data.results.reduce((acc, cur) => {
        // Checks to see if the id of a new post matches the id
        // of any previous posts
        return acc.some((accResult) => accResult.id === cur.id)
          ? // If it does, just returns all posts
            acc
          : //   If it's a new post, returns the spread accumulator
            // (array of posts) with the new post at the end
            [...acc, cur];
        // Appends new results to the existing posts in our posts.results
        // array
      }, prevResource.results),
    }));
  } catch (err) {}
};

export const followHelper = (profile, clickedProfile, following_id) => {
  // This is for the profile the user clicked
  // Updates it's followers count and sets it's following id
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : // This is the logged in user's profile
    // Updates it's following count by 1
    profile.is_owner
    ? {
        ...profile,
        following_count: profile.following_count + 1,
      }
    : // This is not the profile the user clicked or the profile
      // the user owns, so just leaves it unchanged
      profile;
};

export const unfollowHelper = (profile, clickedProfile) => {
  // This is for the profile the user clicked
  // Updates it's followers count and sets it's following id
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null,
      }
    : // This is the logged in user's profile
    // Updates it's following count by 1
    profile.is_owner
    ? {
        ...profile,
        following_count: profile.following_count - 1,
      }
    : // This is not the profile the user clicked or the profile
      // the user owns, so just leaves it unchanged
      profile;
};

// Stores the logged in users refresh token in local storage
export const setTokenTimeStamp = (data) => {
  // Decodes refresh token. Comes with an expiry date (exp)
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

// Refreshes access token only if timestamp exists
export const shouldRefreshToken = () => {
  // The token will be refreshed only for a logged in user
  return !!localStorage.getItem("refreshTokenTimestamp");
};

// Removes localstorage value if user logs out or refesh token
// has expired
export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};
