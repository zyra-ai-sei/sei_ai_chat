import Speak from "@/assets/working/speak.svg?react";
import AI from "@/assets/working/ai.svg?react";
import OnChain from "@/assets/working/onchain.svg?react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PrimaryCard = ({
  index,
  title,
  content,
}: {
  index: string;
  title: string;
  content: string;
}) => {
  const ImageMap: any = {
    "1": <Speak className="size-[64px] " />,
    "2": <AI className="size-[64px] " />,
    "3": <OnChain className="size-[64px] " />,
  };

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
      className="flex flex-col items-center gap-[24px] p-[33px] w-fit max-w-[288px] rounded-[20px] min-h-[217px] bg-[#4B55634D] border border-zinc-800"
    >
      {ImageMap[index]}
      <h1 className="text-[min(6vw,24px)] text-white ">
        {index}
        {"."} {title}
      </h1>
      <p className="text-center text-zinc-500">{content}</p>
    </motion.div>
  );
};

export default PrimaryCard;
