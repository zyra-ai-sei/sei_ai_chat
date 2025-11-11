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
      className="button flex justify-center items-center gap-2 py-3 px-8 rounded-full shadow-white shadow-inner- bg-gradient-to-r from-[#3B82F6] to-[#204887]"
      // initial={{ background: "linear-gradient(to right, #9333EA, #2563EB)" }}
      // animate={controls}
      // whileHover={{
      //   background: "linear-gradient(to right, #2563EB, #9333EA)",
      //   scale: 1.05,
      //   transition: { duration: 0.3 }
      // }}
      style={{ boxShadow: "inset 0px 0px 10px -0.5px rgba(255, 255, 255, 1)"  }}
    >
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2.66669V13.3334C3.99997 13.452 4.03158 13.5685 4.09159 13.6708C4.15159 13.7731 4.23781 13.8576 4.34135 13.9155C4.44489 13.9733 4.562 14.0025 4.68059 14.0001C4.79918 13.9976 4.91497 13.9635 5.016 13.9014L13.6827 8.56802C13.7797 8.50838 13.8599 8.42485 13.9155 8.32542C13.9711 8.22598 14.0003 8.11395 14.0003 8.00002C14.0003 7.8861 13.9711 7.77407 13.9155 7.67463C13.8599 7.5752 13.7797 7.49167 13.6827 7.43202L5.016 2.09869C4.91497 2.03653 4.79918 2.00246 4.68059 1.99998C4.562 1.9975 4.44489 2.02671 4.34135 2.0846C4.23781 2.14248 4.15159 2.22694 4.09159 2.32927C4.03158 2.43159 3.99997 2.54807 4 2.66669Z" fill="white" />
  </svg>
  <div className="text-white text-center font-['Figtree'] font-semibold leading-6">Launch app</div>
    </motion.button>
  );
};