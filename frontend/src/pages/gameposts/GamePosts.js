import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import GamePost from "./GamePost";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function GamePosts({ message, filter = "" }) {
  const [games, setGames] = useState({ results: [] });
  //   Default value of loading spinner is false so spinner
  //   will display until all posts are fetched
  const [hasLoaded, setHasLoaded] = useState(false);
  //   This is for refetching posts when the user clicks home
  // feed or liked links
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetches the posts. The filter parameter tells the api
        // whether we want to see all posts, just the posts of
        // profiles the user follows, or just their liked posts
        // The search parameter takes the text typed in the search bar below
        const { data } = await axiosReq.get(
          `/gaming/?${filter}search=${query}`
        );
        setGames(data);
        // Gets rid of loading spinner once all posts are displayed
        setHasLoaded(true);
      } catch (error) {
        // console.log(error);
      }
    };
    // Loading spinner will be displayed before fetching posts
    setHasLoaded(false);
    // An api request won't be made until 1 second after the final
    // letter has been typed in the search bar
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);
    // Cleanup function that clears the timeout function so no
    // timers are let behind
    return () => {
      clearTimeout(timer);
    };
    // The fetchPosts function will run when either the filter, url
    // or the post typed in the search bar changes
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* Search bar */}
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          // Prevents the page from refreshing after hitting enter
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search gaming posts"
          />
        </Form>

        {/* Popular profiles mobile tab */}
        <PopularProfiles mobile />

        {hasLoaded ? (
          <>
            {/* Checks if there are posts present before mapping
          through them in order to display */}
            {games.results.length ? (
              // Infinite scroll component
              <InfiniteScroll
                // Maps through all the posts before displaying them
                children={games.results.map((game) => (
                  <GamePost key={game.id} {...game} setGames={setGames} />
                ))}
                dataLength={games.results.length}
                loader={<Asset spinner />}
                // Double not operator, which returns true for
                // truthy values and false for falsy
                hasMore={!!games.next}
                // Runs this function (in utils.js) which
                // continuously loads posts if hasMore is true
                next={() => fetchMoreData(games, setGames)}
              />
            ) : (
              // Displays The no-results asset image if there are no posts
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          // Displays spinner if the posts are still loading
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <div className="mb-3">
          {currentUser ? (
            <Link to="/gaming/create">
              <Button>Create gaming post</Button>
            </Link>
          ) : (
            <></>
          )}
        </div>

        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default GamePosts;
