// frontend/src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router does NOT automatically scroll to top on navigation
// (unlike traditional multi-page websites). Without this, navigating
// from the bottom of a long Recipes page to a new page would leave
// you scrolled halfway down the new page too — jarring and confusing.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null; // this component renders nothing — it's pure side-effect
};

export default ScrollToTop;