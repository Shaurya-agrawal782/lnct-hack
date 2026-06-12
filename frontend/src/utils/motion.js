import { useReducedMotion } from 'motion/react';

// Static detection for immediate/non-hook use cases
const isReducedStatic = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: isReducedStatic ? 0.05 : 0.3, ease: 'easeOut' }
  }
};

export const fadeUp = {
  hidden: { opacity: 0, y: isReducedStatic ? 0 : 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: isReducedStatic ? 0.05 : 0.35, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: isReducedStatic ? 0.01 : 0.05,
      delayChildren: 0.02
    }
  }
};

export const listItem = {
  hidden: { opacity: 0, y: isReducedStatic ? 0 : 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: isReducedStatic ? 0.05 : 0.25, ease: 'easeOut' }
  }
};

export const panelReveal = {
  hidden: { opacity: 0, scale: isReducedStatic ? 1 : 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: isReducedStatic ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const cardHover = {
  hover: isReducedStatic ? {} : {
    y: -4,
    boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 3px 6px -3px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

export const softScaleTap = {
  tap: isReducedStatic ? {} : {
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeInOut" }
  }
};

// React hook version for dynamic hook-based updates
export function useResponsiveVariants() {
  const isReduced = useReducedMotion();

  return {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: isReduced ? 0.05 : 0.3, ease: 'easeOut' }
      }
    },
    fadeUp: {
      hidden: { opacity: 0, y: isReduced ? 0 : 15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: isReduced ? 0.05 : 0.35, ease: 'easeOut' }
      }
    },
    staggerContainer: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isReduced ? 0.01 : 0.05,
          delayChildren: 0.02
        }
      }
    },
    listItem: {
      hidden: { opacity: 0, y: isReduced ? 0 : 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: isReduced ? 0.05 : 0.25, ease: 'easeOut' }
      }
    },
    panelReveal: {
      hidden: { opacity: 0, scale: isReduced ? 1 : 0.98 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: isReduced ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }
      }
    },
    cardHover: {
      hover: isReduced ? {} : {
        y: -4,
        boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 3px 6px -3px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.2, ease: "easeInOut" }
      }
    },
    softScaleTap: {
      tap: isReduced ? {} : {
        scale: 0.98,
        transition: { duration: 0.1, ease: "easeInOut" }
      }
    }
  };
}
