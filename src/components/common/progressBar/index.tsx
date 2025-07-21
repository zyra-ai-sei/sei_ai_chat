export type IProgressBar = {
  filledSpots: number;
  totalSpots: number;
};

const ProgressBar = ({ filledSpots, totalSpots }: IProgressBar) => {
  return (
    <div className="bg-neutral-greys-300 w-[72px] h-[8px] overflow-hidden rounded-[20px]">
      <div
        className="bg-neutral-greys-700 h-full"
        style={{ width: `${(filledSpots * 100) / totalSpots}%` }}
      />
    </div>
  );
};

export default ProgressBar;
