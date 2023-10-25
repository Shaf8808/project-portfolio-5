import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Avatar from "../../components/Avatar";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, image, owner } = profile;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  return (
    <div className={`my-3 pb-2 d-flex align-items-left ${mobile}`}>
      <div>
        <Link className="align-self-left" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 pt-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={"text-right ml-auto pt-1"}>
        {/* Checks if the user is NOT on mobile, is logged in and
        is NOT the owner of the profile */}
        {currentUser &&
          !is_owner &&
          // Checks if a following id is present from the api
          (following_id ? (
            // If it is, displays unfollow
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => handleUnfollow(profile)}
            >
              Unfollow
            </Button>
          ) : (
            // If it isn't, means the user is not following
            // so displays follow button
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              // Passes profile as a parameter which is the
              // profile the user clicked on
              onClick={() => handleFollow(profile)}
            >
              Follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
