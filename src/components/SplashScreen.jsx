import React from 'react';
import { motion } from 'framer-motion';

const splashVariants = {
  visible: { opacity: 1, scale: 1, transition: { duration: 1 }},
  hidden: { opacity: 0, scale: 0.8, transition: { duration: 1 }}
};

export default function SplashScreen({ onFinish }) {
  return (
    <motion.div
      initial="visible"
      animate="visible"
      exit="hidden"
      variants={splashVariants}
      style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg, #7f5af0, #9f7efa)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: '#fff', fontSize: 36, fontWeight: 'bold', cursor: 'pointer',
        boxShadow: '0 0 50px #a27fff', userSelect: 'none', zIndex: 20
      }}
      onClick={onFinish}
    >
      Tap to Enter
      <motion.div
        animate={{ x: [0, 300, 0], opacity: [0.2,1,0.2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
          background: 'rgba(255,255,255,0.15)', filter: 'blur(20px)', transform: 'skewX(-20deg)'
        }}
      />
    </motion.div>
  );
}
