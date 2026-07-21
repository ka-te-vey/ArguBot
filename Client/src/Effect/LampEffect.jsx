import React from "react";
import { motion } from "motion/react";

/**
 * LampEffect / LampContainer component inspired by Aceternity UI
 * Creates a dramatic glowing overhead lamp beam effect for background elements,
 * usable both full-screen and embedded at the bottom/footer of forms and cards.
 */
export function LampContainer({ children, className = "", isDark = true, bg = "" }) {
  const defaultBg = isDark ? "bg-[#1E1E1F]" : "bg-white";
  const maskBg = bg || defaultBg;

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden w-full z-0 rounded-2xl ${maskBg} ${className}`}
    >
      <div className="relative flex w-full flex-1 items-center justify-center isolate z-0 select-none pointer-events-none min-h-[140px]">
        {/* Left Conic Lamp Beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "12rem" }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at 50% 0%, #a855f7 0deg, transparent 60deg, transparent 360deg)`,
          }}
          className="absolute inset-auto right-1/2 h-44 overflow-visible w-[24rem] text-white"
        >
          <div className={`absolute w-[100%] left-0 ${maskBg} h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]`} />
          <div className={`absolute w-32 h-[100%] left-0 ${maskBg} bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]`} />
        </motion.div>

        {/* Right Conic Lamp Beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "12rem" }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at 50% 0%, transparent 0deg, transparent 300deg, #a855f7 360deg)`,
          }}
          className="absolute inset-auto left-1/2 h-44 w-[24rem] text-white"
        >
          <div className={`absolute w-32 h-[100%] right-0 ${maskBg} bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]`} />
          <div className={`absolute w-[100%] right-0 ${maskBg} h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]`} />
        </motion.div>

        {/* Soft Background Blurs */}
        <div className={`absolute top-1/2 h-36 w-full translate-y-8 scale-x-150 ${maskBg} blur-2xl`}></div>
        <div className="absolute top-1/2 z-50 h-36 w-full bg-transparent opacity-10 backdrop-blur-md"></div>

        {/* Center Purple Glowing Orb */}
        <div className="absolute inset-auto z-50 h-28 w-[22rem] -translate-y-1/2 rounded-full bg-purple-500 opacity-50 blur-3xl"></div>

        {/* Animated Middle Light Core */}
        <motion.div
          initial={{ width: "6rem" }}
          whileInView={{ width: "14rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-28 w-56 -translate-y-[4rem] rounded-full bg-purple-400 blur-2xl opacity-80"
        ></motion.div>

        {/* Top Horizontal Lamp Beam Edge Line */}
        <motion.div
          initial={{ width: "12rem" }}
          whileInView={{ opacity: 1, width: "24rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[24rem] -translate-y-[5rem] bg-purple-400 shadow-[0_0_15px_#c084fc]"
        ></motion.div>

        <div className={`absolute inset-auto z-40 h-36 w-full -translate-y-[9rem] ${maskBg}`}></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-50 flex flex-col items-center px-2 w-full">
        {children}
      </div>
    </div>
  );
}

export const LampEffect = LampContainer;
export default LampContainer;

