import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0A0C]">
      {/* Deep dark gradient field */}
      <div className="absolute inset-0 bg-radial from-[#141419] via-[#0A0A0C] to-[#050506] opacity-90" />

      {/* Primary Ambient Drifting Lime Glow (Top Right) */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.12, 0.22, 0.15, 0.12],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -right-32 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-radial from-[#C7F464]/25 via-[#C7F464]/5 to-transparent blur-[100px]"
      />

      {/* Secondary Ambient Subtle Lime Glow (Bottom Left) */}
      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 40, -40, 0],
          scale: [0.9, 1.15, 1, 0.9],
          opacity: [0.08, 0.18, 0.1, 0.08],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-radial from-[#C7F464]/20 via-[#C8B9FF]/10 to-transparent blur-[120px]"
      />

      {/* Center Drifting Soft Atmospheric Light */}
      <motion.div
        animate={{
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.03, 0.08, 0.04, 0.03],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-radial from-[#C7F464]/15 via-[#111118]/20 to-transparent blur-[140px]"
      />

      {/* Moving Light Trail Sweep Bar */}
      <motion.div
        animate={{
          y: ['-100%', '200%'],
          opacity: [0, 0.15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-[#C7F464]/10 to-transparent blur-2xl"
      />

      {/* Subdued Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85" />

      {/* Subtle Grain / Grid Lines Layer */}
      <div
        className="absolute inset-0 opacity-[0.035] bg-repeat"
        style={{
          backgroundImage: `radial-gradient(rgba(199, 244, 100, 0.6) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};
