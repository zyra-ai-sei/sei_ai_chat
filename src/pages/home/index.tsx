import Header from "@/components/common/header";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Milestones from "./components/Milestones";
import Working from "./components/Working";
import Footer from "@/components/common/footer";
import { Calendar24 } from "@/components/common/calendar";

const Home = () => {
  return (
    <div className="flex flex-col gap-[100px]  mx-auto relative">
      <Header/>
      <Hero/>
      <Working/>
      <Features/>
      <Milestones/>
      <Calendar24/>
      <Footer/>
    </div>
  );
};

export default Home;
