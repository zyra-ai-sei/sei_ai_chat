import Header from "@/components/common/header";
import Milestones from "./components/Milestones";
import Working from "./components/Working";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "@/components/common/footer";
import BulgeGrid from "./components/Grid";
import HeroSection from "./components/HeroSection";
import TrackingFeatures from "./components/TrackingFeatures";
import { SEO } from "@/components/common/SEO";
import Orbs from "./components/Orbs";
import MultiChain from "./components/MultiChain";

const Home = () => {
  return (
    <div className="flex flex-col gap-[50px] w-full min-h-screen relative bg-[#0D0C11]">
      <SEO 
        title="Home" 
        description="Trade crypto with natural language. Manage your portfolio, execute strategies, and track wallets using Zyra AI on Sei Network."
      />
      <BulgeGrid />
      <Header />
      <HeroSection />
      <Working />
      <TrackingFeatures />
      <Orbs/>
      <MultiChain/>
      {/* <ChatDemo /> */}
      <Milestones />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
