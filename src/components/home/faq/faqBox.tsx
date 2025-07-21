import { Collapse, CollapseProps } from "antd";
import CollaspeIcon from "@/assets/home/collaspeIcon.svg?react";
import ExpandIcon from "@/assets/home/expandIcon.svg?react";
import "./index.scss";
import ApplicationConfig from "@/ApplicationConfig";
function FaqBox() {
  const text = (
    <div className="border-t-[1px] border-solid border-neutral-greys-300">
      <p className="rounded-[140px] bg-neutral-greys-300 px-[8px] py-[4px] typo-b3-regular text-neutral-greys-800 max-w-[90px] text-center mt-[16px]">
        Squad Size
      </p>
      <p className="text-neutral-greys-800 typo-b3-regular mt-[8px]">
        To join the game select a fantasy football squad of 15 players,
        consisting of:
      </p>
      <ul className="text-neutral-greys-800 typo-b3-regular">
        <li className="mt-[6px]"> 2 Goalkeepers </li>
        <li className="mt-[6px]"> 5 Defenders </li>
        <li className="mt-[6px]">5 Midfielders </li>
        <li className="mt-[6px]"> 3 Forwards</li>
      </ul>
      <p className="rounded-[140px] bg-neutral-greys-300 px-[8px] py-[4px] typo-b3-regular text-neutral-greys-800 max-w-[63px] text-center mt-[16px]">
        Budget
      </p>
      <p className="text-neutral-greys-800 typo-b3-regular mt-[8px]">
        The total value of your initial squad must not exceed £100 million.
      </p>
      <p className="rounded-[140px] bg-neutral-greys-300 px-[8px] py-[4px] typo-b3-regular text-neutral-greys-800 max-w-[128px] text-center mt-[16px]">
        Players per Team
      </p>
      <p className="text-neutral-greys-800 typo-b3-regular mt-[8px]">
        You can select up to 3 players from a single Premier League team.
      </p>
    </div>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <h5 className="text-neutral-greys-950 typo-b1-semiBold">
          Selecting a squad
        </h5>
      ),
      children: text,
    },
    {
      key: "2",
      label: (
        <h5 className="text-neutral-greys-950 typo-b1-semiBold">
          Managing a Squad
        </h5>
      ),
      children: text,
    },
    {
      key: "3",
      label: (
        <h5 className="text-neutral-greys-950 typo-b1-semiBold">Transfers</h5>
      ),
      children: text,
    },
    {
      key: "4",
      label: (
        <h5 className="text-neutral-greys-950 typo-b1-semiBold">Deadlines</h5>
      ),
      children: text,
    },
    {
      key: "5",
      label: (
        <h5 className="text-neutral-greys-950 typo-b1-semiBold">Prizes</h5>
      ),
      children: text,
    },
  ];
  return (
    <section>
      <h5 className="text-neutral-greys-950 typo-h5-semiBold">FAQ’s</h5>
      <p className="mt-[8px] text-neutral-greys-800 typo-b3-regular">
        Select a maximum of {ApplicationConfig.maxPlayerPerTeam} players from a
        single team.
      </p>
      <div className="mt-[24px]">
        <Collapse
          accordion
          items={items}
          bordered={false}
          defaultActiveKey={"1"}
          expandIconPosition="end"
          expandIcon={(panelProps) =>
            panelProps.isActive ? (
              <CollaspeIcon className="h-[42px] w-[42px]" />
            ) : (
              <ExpandIcon className="h-[42px] w-[42px]" />
            )
          }
          className="text-neutral-greys-950"
        />
      </div>
    </section>
  );
}

export default FaqBox;
