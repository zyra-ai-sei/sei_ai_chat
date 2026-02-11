import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const LaunchButton = () => {
  const navigate = useNavigate();



  return (
    <motion.button
      onClick={() => navigate('/chat')}
      className="button flex justify-center group  transition-all transform items-center gap-2 py-3 px-8 rounded-full bg-gradient-to-r from-[#1956b68a] to-[#094dbb1b]"
    >
      <svg className="group-hover:scale-110 transition-all transform duration-300 ease-out" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2.66669V13.3334C3.99997 13.452 4.03158 13.5685 4.09159 13.6708C4.15159 13.7731 4.23781 13.8576 4.34135 13.9155C4.44489 13.9733 4.562 14.0025 4.68059 14.0001C4.79918 13.9976 4.91497 13.9635 5.016 13.9014L13.6827 8.56802C13.7797 8.50838 13.8599 8.42485 13.9155 8.32542C13.9711 8.22598 14.0003 8.11395 14.0003 8.00002C14.0003 7.8861 13.9711 7.77407 13.9155 7.67463C13.8599 7.5752 13.7797 7.49167 13.6827 7.43202L5.016 2.09869C4.91497 2.03653 4.79918 2.00246 4.68059 1.99998C4.562 1.9975 4.44489 2.02671 4.34135 2.0846C4.23781 2.14248 4.15159 2.22694 4.09159 2.32927C4.03158 2.43159 3.99997 2.54807 4 2.66669Z" fill="white" />
  </svg>
  <div className="text-[#f6f4f4] text-center font-['Figtree'] group-hover:scale-105 transition-all transform duration-300 ease-out font-semibold leading-6">Launch app</div>
    </motion.button>
  );
};