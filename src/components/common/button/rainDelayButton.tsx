import Delay from "../../../assets/home/rain.svg";

export const RainDelay = () => {
  return (
    <div className="flex absolute top-[10px] right-[10px]">
      <div className="flex gap-[4px] rounded-[90px] py-[10px] px-[12px] bg-[#431407]">
        <img src={Delay} alt="" />
        <p className="text-[#F97316] text-[12px]">Toss has been delayed</p>
      </div>
    </div>
  );
};
