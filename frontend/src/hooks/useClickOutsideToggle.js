import { useEffect, useRef, useState } from "react";

const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Function that collapses burger menu when a user
    // clicks outside
    const handleClickOutside = (event) => {
      // Checks to see if the user has clicked away from menu
      // or if a user clicks on a page (ref.current)
      if (ref.current && !ref.current.contains(event.target)) {
        // Closes dropdown menu
        setExpanded(false);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      // Removes it in case it is used on an element that could unmount
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);
  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
