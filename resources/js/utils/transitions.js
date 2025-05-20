// transitions.js
// Optimized animation variants for Framer Motion

// Fade transition - lightweight and smooth
export const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

// Slide transition - for page changes
export const slideTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2, ease: "easeInOut" }
};

// Scale transition - for components that need emphasis
export const scaleTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15 }
};

// Container stagger effect - for lists of items
export const containerTransition = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Item transition - for individual items in a container
export const itemTransition = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

// Optimized hover and tap animations
export const buttonHoverTap = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 }
};

// Optimized card hover effect
export const cardHover = {
  whileHover: { y: -5, transition: { duration: 0.2 } }
};

// Performance optimized animation settings
export const animationConfig = {
  // Use transform instead of opacity/top for better performance
  transformValues: {
    // Force hardware acceleration
    translateZ: 0,
    // Reduce visual complexity
    backfaceVisibility: "hidden"
  },
  // Reduce animation work for non-visible elements
  shouldReduceMotion: typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches
};
