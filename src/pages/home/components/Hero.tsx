import NewIcon from "@/assets/home/new_icon.png";
import Message from "@/assets/home/message.png";
import { FlipLink } from "@/components/animation/FlipLink";
import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Parallax speed={-2}>
      <div className="relative h-screen bg-gradient-to-b from-[#a880f7] to-[#a880f7]  overflow-visible">
        <div className="flex flex-col items-center justify-center bg-gradient-to-b text-purple-50 from-black via-[#2f0061] to-[#a880f7] h-[85%] z-0 overflow-visible">
          <div className="flex flex-col gap-6 text-[calc(10px+3vw)] w-fit text-center font-semibold text-white relative">
            <FlipLink href={"#"}>YOUR&nbsp;AI-POWERED </FlipLink>
            <FlipLink href="#">CRYPTO&nbsp;ASSISTANT</FlipLink>
            {/* Left icon with synchronized rotation and floating */}
            <motion.img
              src={NewIcon}
              className="size-[10vw] absolute -bottom-[3vw] -left-[9vw] opacity-90"
              animate={{
                y: [-5, 5, -5],
                rotate: [-3, 3, -3],
                transition: {
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }}
            />

            {/* Right icon with opposite phase animation */}
            <motion.img
              src={Message}
              className="size-[10vw] absolute bottom-[3vw] -right-[8vw]"
              animate={{
                y: [5, -5, 5], // Opposite starting position
                rotate: [2, -2, 2], // Subtler, opposite rotation
                transition: {
                  duration: 3.5, // Slightly different timing for natural feel
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }}
            />
          </div>
          <p className="text-gray-300 max-w-[50vw] text-center p-4 text-[1vw] ">
            Zyra turns natural language into real transactions on Sei. Market orders, DCA, limit trades — all via chat.
          </p>
        </div>

        <div className="relative h-[30%] -mt-32 md:-mt-32 lg:-mt-[6vw]">
          {/* Curved div with clip path */}
          <div
            className="h-full w-full relative bg-red-200 pt-60 flex flex-col items-center bg-gradient-to-b from-[#9861f7] via-[#2c1355] to-[#04000b]"
            style={{ clipPath: "ellipse(70% 100% at bottom)" }}
          >
            {/* Curve content goes here */}
          </div>
          <div
            className="h-full opacity-5 w-full absolute bg-gradient-to-b top-16 flex flex-col items-center  from-[#04000a] via-[#000000] backdrop-blur-xl to-[#04000b]"
            style={{
              clipPath: "ellipse(70% 100% at bottom top)",
              boxShadow: "1px -50px 30px 7px rgba(0,0,0)",
            }}
          >
            {/* Curve content goes here */}
          </div>
          <div
            className="h-full opacity-15 w-full absolute bg-gradient-to-b top-20 flex flex-col items-center  from-[#04000a] via-[#000000] backdrop-blur-xl to-[#04000b]"
            style={{
              clipPath: "ellipse(70% 100% at bottom top)",
              boxShadow: "1px -50px 30px 7px rgba(0,0,0)",
            }}
          >
            {/* Curve content goes here */}
          </div>

          {/* Button as a sibling, not a child of the clipped div */}
          <button onClick={()=>navigate("/chat")} className="absolute z-30 p-3 px-4 text-black duration-500 transform -translate-x-1/2 bg-white rounded-full hover:bg-white/90 hover:text-gray-700 active:scale-95 left-1/2 -top-6">
            Try Zyra Now
          </button>
        </div>
      </div>
    </Parallax>
  );
};

export default Hero;
