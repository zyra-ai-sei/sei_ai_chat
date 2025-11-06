import Header from "@/components/common/header";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Milestones from "./components/Milestones";
import Working from "./components/Working";
import TradeLanguage from "./components/TradeLanguage";
import ConnectedChains from "./components/ConnectedChains";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "@/components/common/footer";

const Home = () => {
  return (
    <div className="flex flex-col gap-[50px] w-full min-h-screen relative bg-[#0D0C11]">
      <Header />
      <Hero />
      {/* <Trusted /> */}
      <Working />
      <Features />
      {/* <ChatDemo /> */}
      <TradeLanguage />
      <ConnectedChains />
      <Milestones />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
