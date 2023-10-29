import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import parse from "html-react-parser";

function PostPage() {
  // Accesses the post id passed in the url route
  const { id } = useParams();
  //   Covers both a single post object, or an array of multiple posts
  const [post, setPost] = useState({ results: [] });
  // Variables for displaying parsed content
  const [content, setContent] = useState("");

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;

  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        // Destructures data and renames to post
        // Promise.all accepts an array of promises
        // and gets resolved when all the promises
        // get resolved, returning an array of data
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        // Sets results to post
        setPost({ results: [post] });
        // Calls function below
        parseContent(post.content);

        setComments(comments);
      } catch (error) {
        // console.log(error);
      }
    };
    // Runs this function everytime the post id changes in the url
    handleMount();
  }, [id]);

  // Function for parsing content
  const parseContent = (postContent) => {
    let newContent = parse(postContent);
    setContent(newContent);
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2 col-lg-12" lg={8}>
        <Post {...post.results[0]} setPosts={setPost} postPage />
        {/* Checks that the post existed before 
        trying to display it in the container */}
        {post.results.length > 0 && (
          <Container className={appStyles.Content}>
            {/* Post is saved in the results array, 
            so we have go through there to get to the
            content  */}
            {content}
          </Container>
        )}
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            <h4>Comments</h4>
          ) : null}
          {/* First checks if there are any posted comments */}
          {comments.results.length ? (
            // Infinite scroll component
            <InfiniteScroll
              // Then maps over the comments
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              // // Double not operator, which returns true for
              // truthy values and false for falsy
              hasMore={!!comments.next}
              // Passes fetchmoreData function from the utils folder
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : // If there are no comments, then checks if the current user is logged in
          currentUser ? (
            <span>
              <i
                className={`fa-solid fa-face-sad-tear ${appStyles.SadIcon}`}
              ></i>
              No comments yet, be the first and get ahead of the game!
            </span>
          ) : (
            // If the user is not logged in
            <span>
              <i
                className={`fa-solid fa-face-sad-tear ${appStyles.SadIcon}`}
              ></i>
              No comments yet
            </span>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default PostPage;
