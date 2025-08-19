import { useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";

export const LaunchButton = () => {
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const [_isAnimating, setIsAnimating] = useState(false);

  // Define gradient variations
  const gradients = [
    "linear-gradient(to right, #9333EA, #2563EB)",  // Default purple to blue
    "linear-gradient(to right, #2563EB, #06b6d4)",  // Blue to cyan
    "linear-gradient(to right, #06b6d4, #9333EA)",  // Cyan to purple
  ];

  // Initial animation on load
  useEffect(() => {
    controls.start({
      background: gradients[0],
      transition: { duration: 1 },
    });
  }, []);

  // Interval animation every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      
      // Cycle through gradients
      const randomIndex = Math.floor(Math.random() * gradients.length);
      controls.start({
        background: gradients[randomIndex],
        transition: { duration: 1 },
      }).then(()=>{

        controls.start({
          background: gradients[0],
          transition: { duration: 1 },
        });
      })
      
      // Reset after animation completes
      setTimeout(() => setIsAnimating(false), 1000);
    }, 6000); // Every minute

    return () => clearInterval(intervalId);
  }, [controls]);

  return (
    <motion.button
      onClick={() => navigate('/chat')}
      className="rounded-full py-1 md:py-2 px-3 cursor-pointer backdrop-blur-sm transition-all duration-500 md:px-5 text-white text-[12px] md:text-[16px] font-light"
      initial={{ background: "linear-gradient(to right, #9333EA, #2563EB)" }}
      animate={controls}
      whileHover={{
        background: "linear-gradient(to right, #2563EB, #9333EA)",
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      style={{ backgroundSize: "200% 100%" }}
    >
      Launch App
    </motion.button>
  );
};