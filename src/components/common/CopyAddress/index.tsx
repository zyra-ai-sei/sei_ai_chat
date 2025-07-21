import "./index.scss";

import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "antd";
import { FixTypeLater } from "react-redux";
import CopyIcon from "@/assets/header/copy.svg?react";

function CopyAddress({ address, tips }: FixTypeLater) {
  const [copied, setIsCopied] = React.useState(false);

  const copy = () => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return copied ? (
    <div className={""}>
      {tips ? (
        <Tooltip title="Copied!">
          <div
            className={"i_icon_a i_icon_18 i_copy_white mr-2 align-middle"}
          ></div>
        </Tooltip>
      ) : (
        <>
             <div
        className={
          "copy_address_box rounded-[90px] bg-neutral-greys-100 py-[8px] px-[12px] text-neutral-greys-500 flex items-center gap-x-[8px]"
        }
      >
        <CopyIcon className="h-[20px] w-[20px]" />

        {!tips && <p className={"typo-b2-regular "}>Copied</p>}
      </div>
        </>
      )}
    </div>
  ) : (
    <CopyToClipboard text={address || ""} onCopy={copy}>
      <div
        className={
          "copy_address_box rounded-[90px] bg-neutral-greys-100 py-[8px] px-[12px] text-neutral-greys-500 flex items-center gap-x-[8px]"
        }
      >
        <CopyIcon className="h-[20px] w-[20px]" />

        {!tips && <p className={"typo-b2-regular "}>Copy address</p>}
      </div>
    </CopyToClipboard>
  );
}

export default CopyAddress;
