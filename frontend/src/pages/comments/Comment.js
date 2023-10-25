import React, { useState } from "react";
import styles from "../../styles/Comment.module.css";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
  } = props;

  // This toggles the comment edit form, which is set to
  // false by default
  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentUser();
  // Checks if the username of the current user matches the post's owner
  const is_owner = currentUser?.username === owner;

  // Function for deleting comments
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      // Updates the post results array with the new comment count
      setPost((prevPost) => ({
        results: [
          // Decrements comment count by 1 after deletion and displays it
          // below the post
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));
      // Removes the deleted comment
      setComments((prevComments) => ({
        ...prevComments,
        // Removes the comment that matches the comment id selected
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (error) {}
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            // The setShowEditForm is a function that will enable
            // a comment owner to toggle the edit form
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            // set show edit form is set to true so the edit
            // form is displayed once the icon is clicked
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
};

export default Comment;
