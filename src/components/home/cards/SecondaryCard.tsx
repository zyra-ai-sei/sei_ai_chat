import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SecondaryCard = ({
  image,
  title,
  content,
  className,
}: {
  image: string;
  title: string;
  content: string;
  className: string;
}) => {
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0.5,
    triggerOnce: true,
  });
  const variants = {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: {
      opacity: 0,
      scale: 0.65,
      y: 50,
    },
  };
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={`flex flex-col lg:h-[190px] w-[240px] md:w-[390px] gap-2 rounded-2xl items-start border border-zinc-700 p-[33px] ${className}`}
    >
      <img src={image} className="h-[40px]" alt={title} />
      <h1 className="text-white font-semibold text-[14px]">{title}</h1>
      <p className="text-[12px] font-normal text-[#CCCCCC] text-left">
        {content}
      </p>
    </motion.div>
  );
};

export default SecondaryCard;
