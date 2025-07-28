
import InputBox from "@/components/common/inputBox";
import ResponseBox from "@/components/common/responseBox";
function Home() {
  return (
    <div className="h-full p-4 overflow-hidden">
      <div className="flex flex-col justify-end h-full gap-0 lg:max-w-[60%] mx-auto">
        <ResponseBox/>
        <InputBox />
      </div>
    </div>
  );
}

export default Home;
