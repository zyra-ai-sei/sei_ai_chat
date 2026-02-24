import React, { useEffect, useState } from "react";
import X1 from "@/assets/home/x_profile1.svg";
import X2 from "@/assets/home/x_profile2.jpg";
import X3 from "@/assets/home/x_profile3.jpg";
import X4 from "@/assets/home/x_profile4.jpg";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OrbitingIcon = ({
  radius,
  angle,
  duration,
  delay,
  children,
  reverse = false,
}: {
  radius: number;
  angle: number;
  duration: number;
  delay: number;
  children: React.ReactNode;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      initial={{ rotate: angle }}
      animate={{ rotate: reverse ? angle - 360 : angle + 360 }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
      style={{
        width: radius * 2,
        height: radius * 2,
        x: -radius,
        y: -radius,
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* <motion.div
          initial={{ rotate: -angle }}
          animate={{ rotate: reverse ? -angle + 360 : -angle - 360 }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
         > */}
        {children}
        {/* </motion.div> */}
      </div>
    </motion.div>
  );
};

const TrackingFeatures = () => {
  const [scale, setScale] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(0.5); // Mobile
      } else if (width < 1024) {
        setScale(0.75); // Tablet
      } else {
        setScale(1); // Desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate some random addresses for Jazzicons
  const addresses = [
    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  ];

  const baseRadii = [150, 250, 350];
  const currentRadii = baseRadii.map((r) => r * scale);
  const ringSizes = currentRadii.map((r) => r * 2);

  return (
    <section
      id="tracking"
      className="relative w-full py-16 md:py-32 overflow-hidden pointer-events-none"
    >
      {/* Background gradients */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-[#c430c90a] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-8 z-10 w-full">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-['Figtree'] text-white/80">
              Live Tracking
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Figtree'] text-white leading-[1.1] tracking-tight">
            Unlock Crypto AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Money Flows
            </span>
          </h2>
          <p className="text-lg text-gray-400 font-['Figtree'] max-w-xl leading-relaxed">
            Track smart money wallets and influential X accounts in real-time
            with Zyra's Crypto AI. Get trading signals and instant alerts when
            whales buy or influencers tweet about a token.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button
              onClick={() => navigate("/dashboard#walletWatcher")}
              className="px-8 pointer-events-auto py-4 rounded-full bg-white text-black font-semibold font-['Figtree'] hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              Start Tracking
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex -space-x-4">
              {[X1, X2, X3].map((img, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#0D0C11] overflow-hidden"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Orbit Visualization */}
        <div className="flex-1 relative w-full flex items-center justify-center min-h-[450px] md:min-h-[600px] lg:min-h-[800px]">
          {/* Central Hub */}
          <div
            className="relative z-20 flex flex-col items-center justify-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_0_50px_-12px_rgba(124,58,237,0.5)] transition-all duration-500"
            style={{ width: 160 * scale, height: 160 * scale }}
          >
            <span
              className="font-bold text-white font-['Figtree'] transition-all duration-500"
              style={{ fontSize: `${2.25 * scale}rem` }}
            >
              20k+
            </span>
            <span
              className="text-gray-400 font-['Figtree'] transition-all duration-500"
              style={{ fontSize: `${0.875 * scale}rem` }}
            >
              Tracked Entities
            </span>
          </div>

          {/* Orbits Background Rings */}
          {ringSizes.map((size, i) => (
            <div
              key={i}
              className="absolute border border-white/5 rounded-full transition-all duration-500"
              style={{ width: size, height: size }}
            />
          ))}

          {/* Orbiting Elements */}

          {/* Inner Ring - X Accounts */}
          <OrbitingIcon
            radius={currentRadii[0]}
            angle={0}
            duration={45}
            delay={0}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <img
                src={X1}
                alt="Twitter Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </OrbitingIcon>
          <OrbitingIcon
            radius={currentRadii[0]}
            angle={180}
            duration={45}
            delay={0}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <img
                src={X2}
                alt="Twitter Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </OrbitingIcon>

          {/* Middle Ring - Wallets */}
          <OrbitingIcon
            radius={currentRadii[1]}
            angle={45}
            duration={45}
            delay={0}
            reverse
          >
            <div className="p-1 bg-[#0D0C11] rounded-full border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Jazzicon
                diameter={scale < 0.8 ? 32 : 48}
                seed={jsNumberForAddress(addresses[0])}
              />
            </div>
          </OrbitingIcon>
          <OrbitingIcon
            radius={currentRadii[1]}
            angle={165}
            duration={45}
            delay={0}
            reverse
          >
            <div className="p-1 bg-[#0D0C11] rounded-full border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Jazzicon
                diameter={scale < 0.8 ? 32 : 48}
                seed={jsNumberForAddress(addresses[1])}
              />
            </div>
          </OrbitingIcon>
          <OrbitingIcon
            radius={currentRadii[1]}
            angle={285}
            duration={45}
            delay={0}
            reverse
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <img
                src={X3}
                alt="Twitter Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </OrbitingIcon>

          {/* Outer Ring - Mixed */}
          <OrbitingIcon
            radius={currentRadii[2]}
            angle={90}
            duration={45}
            delay={10}
          >
            <div className="p-1 bg-[#0D0C11] rounded-full border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Jazzicon
                diameter={scale < 0.8 ? 40 : 56}
                seed={jsNumberForAddress(addresses[2])}
              />
            </div>
          </OrbitingIcon>
          <OrbitingIcon
            radius={currentRadii[2]}
            angle={270}
            duration={45}
            delay={0}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <img
                src={X4}
                alt="Twitter Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </OrbitingIcon>
        </div>
      </div>
    </section>
  );
};

export default TrackingFeatures;
