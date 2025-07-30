import Features from "./components/Features";
import Hero from "./components/Hero";
import Milestones from "./components/Milestones";
import Working from "./components/Working";

const Home = () => {
  return (
    <div className="flex flex-col gap-[64px]">
      <Hero/>
      <Working/>
      <Features/>
      <Milestones/>
    </div>
  );
};

export default Home;
