import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";

const NavBar = () => {
  // use context function, imports currentuser variable from
  // CurrentUserContext.js
  const currentUser = useCurrentUser();

  const setCurentUser = useSetCurrentUser();

  // Uses destructuring and references/imports Toggle function in hooks
  // so it is more re-usable
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // console.log(err);
    }
  };

  // Displays username if a user is logged in
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>
        Liked
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign Out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} height={40} />
        {currentUser?.username}
      </NavLink>
    </>
  );
  // Variable for all links shown if a user is logged out
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign In
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fas fa-user-plus"></i>Sign Up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      bg="dark"
      variant="dark"
      expand="md"
      fixed="top"
    >
      <Container>
        {currentUser ? (
          <NavLink to="/posts/create">
            <Navbar.Brand>
              <img src={logo} alt="logo" height="45" />
            </Navbar.Brand>
          </NavLink>
        ) : (
          <NavLink to="/">
            <Navbar.Brand>
              <img src={logo} alt="logo" height="45" />
            </Navbar.Brand>
          </NavLink>
        )}
        <h4 className={`${styles.Logo} mr-3 mt-1`} style={{ color: "white" }}>
          Bloggerize
        </h4>
        <NavDropdown title="Categories" id="basic-nav-dropdown">
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/world">
              World
            </NavLink>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/environment">
              Environment
            </NavLink>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/technology">
              Technology
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/design">
              Design
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/culture">
              Culture
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/business">
              Business
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/politics">
              Politics
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/opinion">
              Opinion
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/science">
              Science
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/health">
              Health
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/style">
              Style
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className={styles.NavDropdown} to="/category/travel">
              Travel
            </NavLink>
          </NavDropdown.Item>
        </NavDropdown>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>
            {/* Displays appropriate icons whether or not a user is logged in */}
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
