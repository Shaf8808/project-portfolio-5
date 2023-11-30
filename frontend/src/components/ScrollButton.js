import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "../App.module.css";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 800) {
      setVisible(true);
    } else if (scrolled <= 800) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <div className={styles.ButtonPosition}>
      <Button
        variant="primary"
        className={`${styles.ScrollButton}`}
        onClick={scrollToTop}
        style={{ display: visible ? "inline" : "none" }}
      >
        Back to top<i className="fa-solid fa-arrow-up"></i>
      </Button>
    </div>
  );
};

export default ScrollButton;
