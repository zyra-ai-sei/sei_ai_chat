import transactionBg from "@/assets/home/transaction-interface.png";
import avatar from "@/assets/home/avatar.png";
import metamaskIcon from "@/assets/home/metamask-icon.svg";
import coinbaseIcon from "@/assets/home/coinbase-wallet.png";
import { motion } from "framer-motion";

const ConnectedChains = () => {
  return (
    <section className="bg-[#0D0C11] flex flex-col gap-[48px] md:gap-[64px] items-center justify-center py-[48px] md:py-[84px] w-full">
      <div className="flex flex-col lg:flex-row gap-[48px] lg:gap-[100px] xl:gap-[154px] items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[135px] w-full max-w-[1440px] mx-auto">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-[32px] md:gap-[48px] items-start justify-center w-full lg:max-w-[520px]"
        >
          <div className="flex flex-col gap-[16px] items-start w-full">
            <p className="bg-clip-text font-['Figtree',sans-serif] font-semibold text-[32px] md:text-[48px] leading-[40px] md:leading-[54px] tracking-[-0.96px] text-transparent bg-gradient-to-r from-white to-[#7CABF9]">
              One SDK<br />
              Infinite Possibilities
            </p>
            <p className="font-['Figtree',sans-serif] font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-white">
              Built for developers, the SDK connects seamlessly with DEXs, lending platforms, and wallets on Sei, enabling users to trade, lend, stake, or bridge through simple chat commands.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-l border border-solid border-white from-[#204887] to-[#3B82F6] flex gap-[8px] items-center justify-center px-[32px] py-[12px] rounded-[99px]"
            style={{
              boxShadow: 'inset 0px 0px 6px rgba(255, 255, 255, 0.4), inset 0px 0px 18px rgba(255, 255, 255, 0.16)',
            }}
          >
            <p className="font-['Figtree',sans-serif] font-semibold text-[16px] leading-[24px] text-center text-white whitespace-pre">
              Try our SDK
            </p>
          </motion.button>
        </motion.div>

        {/* Right Side - Transaction Interface Visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block h-[400px] xl:h-[510px] relative w-[280px] xl:w-[351px] flex-shrink-0"
        >
          {/* Background ellipses - No animation */}
          <div className="absolute left-[112px] top-[-14px] w-[244px] h-[46px] opacity-30 blur-[100px] bg-[#204887]"></div>
          <div className="absolute left-[-26px] top-[424px] w-[377px] h-[50px] opacity-30 blur-[100px] bg-[#204887]"></div>

          {/* Transaction Interface Background */}
          <div className="absolute border-2 border-[#EBF3FE] border-solid h-[510px] left-0 rounded-[15px] top-0 w-[351px] overflow-hidden">
            <img
              src={transactionBg}
              alt="Transaction Interface"
              className="absolute inset-0 w-full h-full object-cover rounded-[15px]"
            />
          </div>

          {/* Zyra Avatar - Left side with rotation */}
          <div className="absolute left-[-154px] top-[230px] w-[90px] h-[90px] animate-pulse" style={{ transform: 'rotate(342.239deg)' }}>
            <img src={avatar} alt="Zyra Avatar" className="w-full h-full object-contain" />
          </div>

          {/* MetaMask Wallet Icon - Upper Left */}
          <div className="absolute left-[-80px] top-[147px] w-[51px] h-[51px] rounded-full overflow-hidden bg-white" style={{ transform: 'rotate(349.578deg)' }}>
            <img src={metamaskIcon} alt="MetaMask" className="w-full h-full p-2 object-contain" />
          </div>

          {/* Coinbase Wallet Icon - Lower Left */}
          <div className="absolute left-[-72px] top-[370px] w-[51px] h-[51px] rounded-full overflow-hidden flex items-center justify-center" style={{ transform: 'rotate(18.444deg)' }}>
            <img src={coinbaseIcon} alt="Coinbase" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConnectedChains;
