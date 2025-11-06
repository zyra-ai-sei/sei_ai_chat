import Curve from "@/assets/home/curve.svg?react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avatarImg from "c:/Users/rajad/Downloads/Avater.png";

// Loading Dots Component
const LoadingDots = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return <span>{".".repeat(dots)}</span>;
};

const Hero = () => {
  const navigate = useNavigate();

  // Animation state
  const [showAvatar, setShowAvatar] = useState(true);
  const [userText, setUserText] = useState("");
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [walletStatus, setWalletStatus] = useState<"hidden" | "loading" | "completed">("hidden");
  const [destinationStatus, setDestinationStatus] = useState<"hidden" | "loading" | "completed">("hidden");
  const [showPayloadLoading, setShowPayloadLoading] = useState(false);

  const fullUserText = "I want to send 50 USDC to address\n0x742d35Cc6634C0532925a3b8D8Cc8c4c8\non Ethereum mainnet";

  useEffect(() => {
    const runAnimation = () => {
      // Reset all states
      setShowAvatar(true);
      setUserText("");
      setShowAIResponse(false);
      setWalletStatus("hidden");
      setDestinationStatus("hidden");
      setShowPayloadLoading(false);

      // Stage 1: Show avatar for 1.5 seconds before typing starts
      setTimeout(() => {
        // Stage 2: Hide avatar and start typing animation at the same time
        setShowAvatar(false);

        let charIndex = 0;
        const typingInterval = setInterval(() => {
          if (charIndex <= fullUserText.length) {
            setUserText(fullUserText.slice(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typingInterval);

            // Stage 3: Show AI response after typing completes
            setTimeout(() => {
              setShowAIResponse(true);

              // Stage 4: Start wallet verification
              setTimeout(() => {
                setWalletStatus("loading");

                // Stage 5: Complete wallet verification
                setTimeout(() => {
                  setWalletStatus("completed");

                  // Stage 6: Start destination validation
                  setTimeout(() => {
                    setDestinationStatus("loading");

                    // Stage 7: Complete destination validation
                    setTimeout(() => {
                      setDestinationStatus("completed");

                      // Stage 8: Show payload loading
                      setTimeout(() => {
                        setShowPayloadLoading(true);

                        // Wait 2 seconds then restart animation
                        setTimeout(() => {
                          runAnimation();
                        }, 2000);
                      }, 500);
                    }, 2000);
                  }, 500);
                }, 2000);
              }, 500);
            }, 500);
          }
        }, 50);
      }, 1500);
    };

    runAnimation();
  }, []);

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[780px] bg-[#0D0C11] overflow-hidden">
      {/* Ellipse Blur Effects - No animation */}
      <div className="absolute w-[139px] h-[139px] right-[10%] md:left-[795px] top-[155px] bg-[#204887] blur-[64px] rounded-full" />
      <div className="absolute w-[115px] h-[115px] right-[5%] md:left-[1208px] top-[400px] md:top-[596px] bg-[#204887] blur-[64px] rounded-full" />
      <div className="absolute w-[184px] h-[184px] -left-[33px] top-[119px] bg-[#2A5CAF] blur-[124px] rounded-full" />

      <Curve className="absolute w-full h-[600px] md:h-[750px] opacity-100 text-blue-200"/>

      {/* Main Content - Left Side */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative md:absolute left-0 top-0 md:top-[230px] w-full md:w-[780px] flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 lg:px-[100px] pt-[80px] md:pt-0 gap-8 md:gap-12"
      >
        {/* Header Text Container */}
        <div className="flex flex-col justify-center items-start gap-4 w-full max-w-[551px]">
          {/* Main Heading */}
          <h1 className="bg-clip-text font-['Figtree',sans-serif] font-bold text-[36px] md:text-[48px] lg:text-[56px] leading-[44px] md:leading-[58px] lg:leading-[68px] text-transparent bg-gradient-to-r from-white to-[#7CABF9]">
            YOUR AI-POWERED<br />
            CRYPTO ASSISTANT
          </h1>

          {/* Subtext */}
          <p className="w-full font-['Figtree',sans-serif] font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-[rgba(255,255,255,0.7)]">
            Jumpstart your crypto journey with Zyra. Zyra turns natural language into real transactions on Sei. Market orders, DCA, limit trades, all via chat.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Primary Button */}
          <button
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-l border border-solid border-white from-[#204887] to-[#3B82F6] flex items-center justify-center px-[32px] py-[12px] rounded-[99px]"
            style={{
              boxShadow: 'inset 0px 0px 6px rgba(255, 255, 255, 0.4), inset 0px 0px 18px rgba(255, 255, 255, 0.16)'
            }}>
            <span className="font-['Figtree',sans-serif] font-semibold text-[16px] leading-[24px] text-white text-center whitespace-pre">
              Try Zyra today
            </span>
          </button>

          {/* Secondary Button */}
          <button
            className="bg-[rgba(255,255,255,0.04)] border border-solid border-white flex items-center justify-center px-[32px] py-[12px] rounded-[99px]"
            style={{
              boxShadow: 'inset 0px 0px 6px rgba(255, 255, 255, 0.4), inset 0px 0px 18px rgba(255, 255, 255, 0.16)'
            }}>
            <span className="font-['Figtree',sans-serif] font-semibold text-[16px] leading-[24px] text-white text-center whitespace-pre">
              Learn more
            </span>
          </button>
        </div>
      </motion.div>

      {/* Chat Interface Container - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="absolute w-[471px] h-[514px] left-[834px] top-[180px] rounded-[32px]  "
      >
        {/* Background Gradient Blur 1 */}
        <div className="absolute w-[432px] h-[476px] left-[23px] top-[18px] rounded-[32px] blur-[32px]"
             style={{ 
               background: 'linear-gradient(251.88deg, #8D38DD 0.56%, #3B82F6 99.58%)',
               backgroundBlendMode: 'plus-lighter'
             }}></div>
        
        {/* Background Gradient Blur 2 */}
        <div className="absolute w-[431px] h-[476px] left-[23px] top-[18px] rounded-[32px] blur-[8px]"
             style={{ 
               background: 'linear-gradient(109.23deg, #3B82F6 3.91%, #8D38DD 96.01%)',
               backgroundBlendMode: 'plus-lighter'
             }}></div>

        {/* Main Chat Container */}
        <div className="absolute w-[471px] h-[514px] left-0 top-0 rounded-[24px] flex flex-col"
             style={{
               background: 'linear-gradient(#0D0C11, #0D0C11) padding-box, linear-gradient(to bottom, #7CABF9, #B37AE8) border-box',
               border: '1px solid transparent',
               boxShadow: '0px 0px 16px rgba(124, 171, 249, 0.32)'
             }}>
          
          {/* Chat History Section */}
          <div className="w-[471px] h-[362px] flex flex-col justify-end items-center px-4 rounded-[24px] pt-6 pb-4 gap-6 bg-white/[0.02] border-l border-white/[0.08] relative">

            {/* Avatar - Centered in chat interface container */}
            <AnimatePresence>
              {showAvatar && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute w-[160px] h-[160px] flex items-center justify-center z-20"
                  style={{ left: '155px', top: '155px', transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative w-[160px] h-[160px]">
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full blur-[32px] opacity-60"
                         style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                    {/* Avatar image with pulse */}
                    <div className="relative w-[160px] h-[160px] flex items-center justify-center animate-pulse">
                      <img src={avatarImg} alt="Zyra Avatar" className="w-[160px] h-[160px] object-contain relative z-10" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-start gap-4 w-[439px] relative min-h-full">

              {/* User Input */}
              {userText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col justify-center items-end gap-2 w-[439px]"
                >
                  <div className="flex flex-row justify-center items-center p-3 gap-2 w-[272px] bg-white/[0.04] border border-white/[0.08] rounded-xl">
                    <p className="text-xs leading-4 font-normal text-white whitespace-pre-line w-[248px]" style={{ fontFamily: 'Figtree, sans-serif' }}>
                      {userText}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* AI Response */}
              <AnimatePresence>
                {showAIResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-start gap-2 w-[439px] h-[224px]"
                  >
                    <div className="flex flex-col justify-center items-start p-3 gap-3 w-[439px] h-[224px] bg-white/[0.04] border-2 border-[#7CABF9] rounded-xl">

                    {/* Avatar */}
                    <div className="relative w-6 h-6">
                      <div className="absolute w-6 h-6 left-0 top-0 rounded-full blur-[4px]"
                           style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                      <div className="absolute w-6 h-6 left-0 top-0 rounded-full"
                           style={{
                             background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)',
                             boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.6)'
                           }}>
                        {/* Avatar Icon Content */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[12px] bg-[#0D0C11]/70 rounded px-0.5 flex items-center justify-center gap-1.5"
                             style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.55)' }}>
                          <div className="w-1 h-2 bg-white rounded-full"></div>
                          <div className="w-1 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Container */}
                    <div className="flex flex-col items-start gap-2 w-[415px] h-[164px]">
                      {/* Building transaction header */}
                      <div className="flex flex-row items-start gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                          <rect x="2" y="2.67" width="12" height="10.67" rx="1.33" stroke="white" strokeWidth="1.5"/>
                        </svg>
                        <span className="text-xs leading-4 font-normal"
                              style={{
                                fontFamily: 'Figtree, sans-serif',
                                background: 'linear-gradient(90deg, #FFFFFF 0%, #7CABF9 43.27%, #8D38DD 64.42%, #FFFFFF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}>
                          Building transaction...
                        </span>
                      </div>

                      {/* Progress Block */}
                      <div className="flex flex-col items-start p-3 gap-1 w-[415px] h-[140px] rounded-md"
                           style={{
                             background: 'linear-gradient(#0F0E11, #0F0E11) padding-box, linear-gradient(to bottom, #7CABF9, #B37AE8) border-box',
                             border: '1.5px solid transparent'
                           }}>
                        {/* Wallet Verification */}
                        {walletStatus !== "hidden" && (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between w-full h-7 px-3 gap-2 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                              <div className="flex items-center gap-2">
                                {walletStatus === "completed" && (
                                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="w-[15px] h-[15px]">
                                    <path d="M2.5 5.5V3.5C2.5 2.94772 2.94772 2.5 3.5 2.5H11.5C12.0523 2.5 12.5 2.94772 12.5 3.5V5.5M2.5 5.5H12.5M2.5 5.5V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H11.5C12.0523 12.5 12.5 12.0523 12.5 11.5V5.5M7.5 8.5H7.505" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                <span className={`text-[10px] leading-4 font-normal ${walletStatus === "completed" ? "text-white" : ""}`}
                                      style={walletStatus === "loading" ? {
                                        fontFamily: 'Figtree, sans-serif',
                                        background: 'linear-gradient(90deg, #FFFFFF 0%, #7CABF9 43.27%, #8D38DD 64.42%, #FFFFFF 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                      } : { fontFamily: 'Figtree, sans-serif' }}>
                                  {walletStatus === "loading" ? "Verifying Wallet Address" : "Verified Wallet Address"}
                                  {walletStatus === "loading" && <LoadingDots />}
                                </span>
                              </div>
                              {walletStatus === "completed" && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                  <circle cx="8" cy="8" r="7" fill="#22C55E" stroke="#22C55E" strokeWidth="1"/>
                                  <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Destination Validation */}
                        {destinationStatus !== "hidden" && (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between w-full h-7 px-3 gap-2 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                              <div className="flex items-center gap-2">
                                {destinationStatus === "completed" && (
                                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="w-[15px] h-[15px]">
                                    <path d="M2.5 4.5V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H11.5C12.0523 12.5 12.5 12.0523 12.5 11.5V4.5M2.5 4.5L7.5 2.5L12.5 4.5M2.5 4.5L7.5 7M12.5 4.5L7.5 7M7.5 7V12.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                <span className={`text-[10px] leading-4 font-normal ${destinationStatus === "completed" ? "text-white" : ""}`}
                                      style={destinationStatus === "loading" ? {
                                        fontFamily: 'Figtree, sans-serif',
                                        background: 'linear-gradient(90deg, #FFFFFF 0%, #7CABF9 43.27%, #8D38DD 64.42%, #FFFFFF 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                      } : { fontFamily: 'Figtree, sans-serif' }}>
                                  {destinationStatus === "loading" ? "Validating destination address" : "Validated destination address"}
                                  {destinationStatus === "loading" && <LoadingDots />}
                                </span>
                              </div>
                              {destinationStatus === "completed" && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                  <circle cx="8" cy="8" r="7" fill="#22C55E" stroke="#22C55E" strokeWidth="1"/>
                                  <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Building your transfer payload */}
                        {showPayloadLoading && (
                          <div className="flex items-center px-2 py-1 h-[18px] border border-white/[0.24] rounded-full mt-1">
                            <span className="text-[10px] leading-[14px] font-normal"
                                  style={{
                                    fontFamily: 'Figtree, sans-serif',
                                    background: 'linear-gradient(90deg, #FFFFFF 0%, #7CABF9 43.27%, #8D38DD 64.42%, #FFFFFF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}>
                              Building your transfer payload...
                            </span>
                          </div>
                        )}

                        {/* Disclaimer Text */}
                        {showPayloadLoading && (
                          <p className="text-[8px] leading-[12px] font-normal text-center w-full" style={{ fontFamily: 'Figtree, sans-serif', color: '#04600E', marginTop: '13px' }}>
                            You can review and modify any field before signing. Zyra only prepares the transaction.
                          </p>
                        )}

                      </div>
                    </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Input Section */}
          <div className="w-[471px] h-[152px] flex flex-col items-start p-4 gap-2 rounded-[24px] bg-white/[0.08]">
            {/* Input Container */}
            <div className="flex flex-row justify-between items-end px-3 py-2 w-[439px] h-24 bg-black/[0.54] rounded-xl"
                 style={{ backdropFilter: 'blur(2px)' }}>
              <div className="w-[387px] h-20 flex items-start">
                <span className="text-xs leading-4 font-medium" style={{ fontFamily: 'Figtree, sans-serif', color: 'rgba(255, 255, 255, 0.3)' }}>
                  Describe your blockchain transaction...
                </span>
              </div>
              <button className="flex justify-center items-center p-1.5 w-8 h-8 bg-[#3B82F6] rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                  <path d="M3.33 10H16.67M16.67 10L11.67 5M16.67 10L11.67 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Disclaimer */}
            <p className="w-[439px] h-4 text-xs leading-4 font-normal text-center"
               style={{ fontFamily: 'Figtree, sans-serif', color: 'rgba(255, 255, 255, 0.3)' }}>
              Zyra can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


export default Hero;
