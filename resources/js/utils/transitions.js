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
  shouldReduceMotion: typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches,

  // Mobile-optimized animation settings
  mobile: {
    // Shorter durations for better mobile performance
    duration: 0.2,
    // Reduced stagger for better performance
    staggerChildren: 0.02,
    // Simpler easing functions
    ease: [0.25, 0.46, 0.45, 0.94],
    // Reduced delay
    delayChildren: 0
  },

  // Desktop animation settings
  desktop: {
    duration: 0.3,
    staggerChildren: 0.05,
    ease: [0.25, 0.46, 0.45, 0.94],
    delayChildren: 0.05
  },

  // Performance-optimized variants
  optimizedVariants: {
    // Container animations with conditional performance
    container: (isMobile = false, prefersReducedMotion = false) => ({
      hidden: {
        opacity: prefersReducedMotion ? 0.9 : 0
      },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : (isMobile ? 0.02 : 0.05),
          delayChildren: prefersReducedMotion ? 0 : (isMobile ? 0 : 0.05),
          duration: isMobile ? 0.2 : 0.3
        }
      }
    }),

    // Item animations with reduced motion support
    item: (prefersReducedMotion = false) => ({
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 10
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          type: "tween",
          duration: prefersReducedMotion ? 0.1 : 0.2,
          ease: "easeOut"
        }
      }
    }),

    // Modal/overlay animations
    modal: (prefersReducedMotion = false) => ({
      hidden: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.95
      },
      show: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: prefersReducedMotion ? 0.1 : 0.2,
          ease: "easeOut"
        }
      },
      exit: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.95,
        transition: {
          duration: prefersReducedMotion ? 0.1 : 0.15,
          ease: "easeIn"
        }
      }
    }),

    // Slide animations for mobile menus
    slideIn: (direction = 'left', prefersReducedMotion = false) => ({
      hidden: {
        x: prefersReducedMotion ? 0 : (direction === 'left' ? '-100%' : '100%'),
        opacity: prefersReducedMotion ? 0 : 1
      },
      show: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'tween',
          duration: prefersReducedMotion ? 0.1 : 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      exit: {
        x: prefersReducedMotion ? 0 : (direction === 'left' ? '-100%' : '100%'),
        opacity: prefersReducedMotion ? 0 : 1,
        transition: {
          type: 'tween',
          duration: prefersReducedMotion ? 0.1 : 0.25,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    })
  }
};
