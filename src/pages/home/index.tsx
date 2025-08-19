import Header from "@/components/common/header";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Milestones from "./components/Milestones";
import Working from "./components/Working";
import Footer from "@/components/common/footer";

const Home = () => {
  return (
    <div className="flex flex-col gap-[100px]  mx-auto relative">
      <Header/>
      <Hero/>
      <Working/>
      <Features/>
      <Milestones/>
      <Footer/>
    </div>
  );
};

export default Home;
