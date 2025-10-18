import React, { useEffect } from "react";
import { motion } from "framer-motion";

const splashVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: "easeOut" }
  }
};

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={splashVariants}
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at 20% 15%, #fef2f2 0%, rgba(248, 113, 113, 0.72) 35%, #991b1b 65%, #450a0a 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        cursor: "pointer",
        zIndex: 40,
        padding: "1.5rem"
      }}
      onClick={onFinish}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(153, 27, 27, 0.28)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "24px",
          padding: "2.4rem 2rem",
          textAlign: "center",
          boxShadow: "0 40px 80px -50px rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(12px)",
          maxWidth: "360px",
          width: "100%"
        }}
      >
        <span style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.3em" }}>
          Starshield
        </span>
        <h1 style={{ margin: "0.75rem 0", fontSize: "1.9rem", lineHeight: 1.2 }}>Epoxy Visualizer</h1>
        <p style={{ margin: "0 0 1.2rem", opacity: 0.9 }}>Tap to begin or wait for the experience to load.</p>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          Preparing calculator
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
