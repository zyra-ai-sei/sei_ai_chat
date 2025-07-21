import { Tooltip } from "antd";
import "./index.scss";

import { FixTypeLater } from "react-redux";
import HyperLinkIcon from "@/assets/header/hyperLink.svg?react";

function ViewOnEtherscan({ url, showTitle, toolTips }: FixTypeLater) {
  return (
    <a
      href={url || "#"}
      target={"_blank"}
      className={
        "flex items-center gap-x-[8px] px-[12px] py-[8px] bg-neutral-greys-100 rounded-[90px] text-neutral-greys-500"
      }
      rel="noreferrer"
    >
      {toolTips ? (
        <Tooltip title={toolTips}>
          <div
            className={"i_icon_a i_icon_18 i_external_link_white mr-2"}
          ></div>
        </Tooltip>
      ) : (
        <></>
      )}
      <HyperLinkIcon className=" h-[20px] w-[20px]" />
      {showTitle && (
        <span className={"typo-b2-regular "}>
          Explorer
        </span>
      )}
    </a>
  );
}

export default ViewOnEtherscan;
