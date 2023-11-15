import React from "react";
import styles from "../../styles/Post.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Badge, Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { AdminDropdown } from "../../components/AdminDropdown";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    category,
    title,
    excerpt,
    image,
    updated_at,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  // Checks if it is the owner of the post before assigning
  // it to the is_owner variable
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const location = useLocation();

  const is_admin = currentUser?.username === "theadmin";

  // Function to capitalize first letter of category
  // displayed in a badge
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to redirect users to the edit form page
  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);

      if (location.pathname.indexOf("/posts/") === 0) {
        history.goBack();
        console.log();
      } else {
        window.location.reload();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // Function for liking posts
  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      // Updates the post data
      setPosts((prevPosts) => ({
        // Displays other posts by other users
        ...prevPosts,
        // Maps over all posts
        results: prevPosts.results.map((post) => {
          // Checks if the post id matches to the post that was liked
          return post.id === id
            ? // If it does, increments like count by 1 and matches like id
              // to the data id
              { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : // If the id does not match, returns the post so the map
              // function can move on to the next post
              post;
        }),
      }));
    } catch (error) {
      // console.log(error);
    }
  };

  // Function for unliking a post
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          // Checks if post id matches to the post that has been liked
          return post.id === id
            ? // Decrements likes_count by 1 and sets like_id to null
              { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link className={styles.Link} to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {/* Display edit/delete button if it's the owner of
            the post and the postPage prop exists */}
            {is_owner ? (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ) : is_admin ? (
              <AdminDropdown handleDelete={handleDelete} />
            ) : (
              <></>
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body className={styles.PostBar}>
        {/* Only renders the elements <Card.Title> if the title data is present */}

        <div className={styles.HeartIcon}>
          {title && (
            <Card.Title className={`text-center ${appStyles.ProfileHeader}`}>
              {title}
            </Card.Title>
          )}

          {/* Start of ternary/conditional statement for likes */}
          <div>
            {is_owner ? (
              // Displays a message if it's the owner of the post
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can't like your own post!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            ) : // Checks if the user has already liked the post
            // and allows them to unlike a post
            like_id ? (
              <span onClick={handleUnlike}>
                <i className={`fas fa-heart ${styles.Heart}`} />
              </span>
            ) : // Checks if the user has logged in and lets them like
            // the post
            currentUser ? (
              <span onClick={handleLike}>
                <i className={`far fa-heart ${styles.HeartOutline}`} />
              </span>
            ) : (
              // This message is for the user who is not logged in
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to like posts!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            )}
            {/* Displays the number of likes and comments of the post */}
            {likes_count}
          </div>
        </div>
        {category && (
          <h4 className="text-left">
            <Badge pill variant="primary">
              {capitalize(category)}
            </Badge>
          </h4>
        )}

        <hr />
        <div className={styles.HeartIcon}>
          {excerpt && <Card.Title>{excerpt}</Card.Title>}
          <div>
            <Link to={`/posts/${id}`}>
              <i className="far fa-comments" />
            </Link>
            {comments_count}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
