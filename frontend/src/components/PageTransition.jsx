// frontend/src/components/PageTransition.jsx
import { motion } from "framer-motion";

// Wraps any page's content to give it a subtle fade + slight upward
// slide on mount. Using framer-motion instead of raw CSS animations
// because it correctly re-triggers on every mount (e.g. navigating
// between two recipe detail pages), which plain CSS animations don't
// do automatically without extra key-based tricks.
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;