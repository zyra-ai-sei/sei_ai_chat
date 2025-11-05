import Curve from "@/assets/home/curve.svg?react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[780px] bg-[#0D0C11] overflow-hidden">
      {/* Ellipse Blur Effects */}
      <div className="absolute w-[139px] h-[139px] right-[10%] md:left-[795px] top-[155px] bg-[#204887] blur-[64px] rounded-full"></div>
      <div className="absolute w-[115px] h-[115px] right-[5%] md:left-[1208px] top-[400px] md:top-[596px] bg-[#204887] blur-[64px] rounded-full"></div>
      <div className="absolute w-[184px] h-[184px] -left-[33px] top-[119px] bg-[#2A5CAF] blur-[124px] rounded-full"></div>

      <Curve className="absolute w-full h-[600px] md:h-[750px] opacity-100 text-blue-200"/>

      {/* Main Content - Left Side */}
      <div className="relative md:absolute left-0 top-0 md:top-[289px] w-full md:w-[742px] flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 lg:px-[135px] pt-[120px] md:pt-0 gap-8 md:gap-12">
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
      </div>

      {/* Chat Interface Container - Right Side */}
      <div className="absolute w-[471px] h-[514px] left-[834px] top-[180px]">
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
        <div className="absolute w-[471px] h-[514px] left-0 top-0 bg-[#0D0C11] rounded-[24px] flex flex-col"
             style={{ boxShadow: '0px 0px 16px rgba(124, 171, 249, 0.32)' }}>
          
          {/* Chat History Section */}
          <div className="w-[471px] h-[362px] flex flex-col justify-end items-center px-4 pt-6 pb-4 gap-6 bg-white/[0.02] border-l border-white/[0.08]">
            <div className="flex flex-col items-start gap-4 w-[439px] h-[302px]">
              
              {/* User Input */}
              <div className="flex flex-col justify-center items-end gap-2 w-[439px] h-[72px]">
                <div className="flex flex-row justify-center items-center p-3 gap-2 w-[272px] h-[72px] bg-white/[0.04] border border-white/[0.08] rounded-xl">
                  <p className="w-[248px] h-12 text-xs leading-4 font-normal text-white" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    I want to send 50 USDC to address 0x42d3E5CbE84D03d9623ebb08cC8c8e4d on Ethereum mainnet
                  </p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex flex-col items-start gap-2 w-[439px] h-[214px]">
                <div className="flex flex-col justify-center items-start p-3 gap-3 w-[439px] h-[214px] bg-white/[0.04] rounded-xl">
                  
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

                  {/* Code Container */}
                  <div className="flex flex-col items-start gap-2 w-[415px] h-[154px]">
                    {/* Building transaction header */}
                    <div className="flex flex-row items-start gap-2 w-[139px] h-4">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <rect x="2" y="2.67" width="12" height="10.67" rx="1.33" stroke="white" strokeWidth="1.5"/>
                      </svg>
                      <span className="w-[115px] h-4 text-xs leading-4 font-normal"
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

                    {/* Code Block */}
                    <div className="flex flex-col items-start p-2 gap-2 w-[415px] h-[130px] bg-[#0F0E11] rounded-md">
                      <div className="flex flex-col items-start gap-1 w-[294px] h-[114px]">
                        {/* Code Line 1 */}
                        <div className="flex flex-row items-center w-[294px] h-3">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-80" style={{ fontFamily: 'Figtree, sans-serif' }}>1</span>
                          </div>
                          <div className="flex flex-col justify-center items-start px-1 w-[149px] h-3">
                            <span className="w-[141px] h-[14px] text-[10px] leading-[14px] font-normal text-[#749270] text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                              // USDC License (solidity: GPL)
                            </span>
                          </div>
                        </div>
                        
                        {/* Code Line 2 */}
                        <div className="flex flex-row items-center w-[294px] h-3">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-60" style={{ fontFamily: 'Figtree, sans-serif' }}>2</span>
                          </div>
                          <div className="flex flex-col justify-center items-start px-1 w-[278px] h-3">
                            <span className="w-[270px] h-[14px] text-[10px] leading-[14px] font-normal text-[#749270] text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                              // file: @openzeppelin/contracts/token/ERC20/ERC20.sol
                            </span>
                          </div>
                        </div>
                        
                        {/* Empty Line 3 */}
                        <div className="flex flex-row items-center w-[294px] h-3">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-60" style={{ fontFamily: 'Figtree, sans-serif' }}>3</span>
                          </div>
                        </div>
                        
                        {/* Code Line 4 */}
                        <div className="flex flex-row items-center w-[294px] h-3">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-60" style={{ fontFamily: 'Figtree, sans-serif' }}>4</span>
                          </div>
                          <div className="flex flex-col justify-center items-start px-1 w-[113px] h-3">
                            <span className="w-[105px] h-[14px] text-[10px] leading-[14px] font-normal text-[#565195] text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                              function transfer() ERC20
                            </span>
                          </div>
                        </div>
                        
                        {/* Code Line 5 */}
                        <div className="flex flex-row items-center w-[294px] h-3">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-60" style={{ fontFamily: 'Figtree, sans-serif' }}>5</span>
                          </div>
                          <div className="flex flex-col justify-center items-start px-1 w-[91px] h-3">
                            <span className="w-[83px] h-[14px] text-[10px] leading-[14px] font-normal text-white text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                              interface ERC20 {'{'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Code Line 6 with cursor */}
                        <div className="flex flex-row items-center w-[294px] h-3 relative">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-60" style={{ fontFamily: 'Figtree, sans-serif' }}>6</span>
                          </div>
                          <div className="flex flex-col justify-center items-start px-1 w-[275px] h-3 relative">
                            <span className="w-[267px] h-[14px] text-[10px] leading-[14px] font-normal text-white text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                              event Transfer(address from, address to, uint256 value)
                            </span>
                            <div className="absolute left-[5px] top-0 w-0 h-[12.5px] border-l border-white/20"></div>
                          </div>
                        </div>
                        
                        {/* Code Line 7 - Writing code */}
                        <div className="flex flex-row items-center w-[294px] h-[18px]">
                          <div className="flex flex-col justify-center items-center px-1 w-4 h-3">
                            <span className="w-2 h-[14px] text-[10px] leading-[14px] font-light text-white text-center opacity-60" style={{ fontFamily: 'Figtree, sans-serif' }}>7</span>
                          </div>
                          <div className="flex flex-col justify-center items-start px-2 py-0.5 w-[81px] h-[18px] rounded-full">
                            <span className="w-[65px] h-[14px] text-[10px] leading-[14px] font-normal"
                                  style={{ 
                                    fontFamily: 'Figtree, sans-serif',
                                    background: 'linear-gradient(90deg, #FFFFFF 0%, #7CABF9 43.27%, #8D38DD 64.42%, #FFFFFF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}>
                              Writing code...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Input Section */}
          <div className="w-[471px] h-[152px] flex flex-col items-start p-4 gap-2 bg-white/[0.08]">
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
              Zyra can make mistakes. Check import info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Hero;
