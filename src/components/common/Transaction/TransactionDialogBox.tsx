import "./index.scss";

import { useState, useEffect, useMemo } from "react";
import CrossIcon from "../../../assets/popup/cross.svg?react";
import ViewOnEtherscan from "../ViewOnEtherscan";
import { Modal } from "antd";
import { FixTypeLater } from "react-redux";
import { useWeb3Context } from "../../../hooks/useWeb3Context";
import ConditionDisplay from "../conditionDisplay";
import { generateAddressSummary } from "../../../utility/stringFormat";
import ContractConfig from "../../../contract/ContractConfig";
import { classNames } from "../../../utility/className";
import Button from "./button";
import { ButtonTypesEnum } from "./buttonType.enum";
import TransactionDialogBoxPaid from "./TransactionDialogBoxPaid";
import InfoIcon from '@/assets/common/InfoIcon.svg?react'

export function TransactionDialogBox({
  open,
  onOpen,
  transactionContext,
}: FixTypeLater) {
  const web3Context = useWeb3Context();

  const [titleIcon, setTitleIcon] = useState("title_icon_confirm");
  const [title, setTitle] = useState("Confirm transaction on your wallet");
  const [content, setContent] = useState("Confirm transaction on your wallet");

  const [confirmed, setConfirmed] = useState(false);

  const connectedWalletName = useMemo(() => {
    if (window.localStorage && open) {
      const _lastWalletName =
        window.localStorage.getItem("CURRENT_WALLET_NAME") || "MetaMask";
      return _lastWalletName;
    }

    return "MetaMask";
  }, [open]);

  const onClose = () => {
    onOpen(false);
  };

  useEffect(() => {
    if (transactionContext?.state === "confirm") {
      if (transactionContext?.content === "Update team") {
        setConfirmed(false);
        setTitleIcon("title_icon_confirm");
        setTitle("Approve transaction on your wallet to update the team");
        setContent(transactionContext?.content || "");
      } else {
        setConfirmed(false);
        setTitleIcon("title_icon_confirm");
        setTitle("Approve transaction from  your wallet ");
        setContent(transactionContext?.content || "");
      }
    }

    if (transactionContext?.state === "pending") {
      setConfirmed(true);
      setTitleIcon("title_icon_pending");
      setTitle("Transaction Submitted");
      setContent(transactionContext?.content || "");
    }

    if (
      transactionContext?.state === "success" &&
      transactionContext?.content === "Create Team"
    ) {
      setConfirmed(true);
      setTitleIcon("title_icon_team_success");
      setTitle("You have successfully joined the contest");
      setContent("Join our Telegram channel for match updates");
    }
    if (
      transactionContext?.state === "success" &&
      transactionContext?.content === "Create contest"
    ) {
      setConfirmed(true);
      setTitleIcon("title_icon_team_success");
      setTitle("You have successfully created and joined the contest");
      setContent("Join our Telegram channel for match updates");
    }
    if (
      transactionContext?.state === "success" &&
      transactionContext?.content === "Update team"
    ) {
      setConfirmed(true);
      setTitleIcon("title_icon_team_success");
      setTitle("You have successfully updated your team");
      setContent("Join our Telegram channel for match updates");
    }
    if (
      transactionContext?.state === "success" &&
      transactionContext?.content !== "Create Team" &&
      transactionContext?.content !== "Update team"
    ) {
      setConfirmed(true);
      setTitleIcon("title_icon_success");
      setTitle("Transaction Successful");
      setContent(transactionContext?.content || "");
    }

    if (transactionContext?.state === "failed") {
      setConfirmed(false);
      setTitleIcon("title_icon_failed");
      setTitle("Transaction Failed");
      setContent(transactionContext?.content);
    }

    if (transactionContext?.state === "rejected") {
      setConfirmed(false);
      setTitleIcon("title_icon_failed");
      setTitle("Transaction Rejected");
      setContent(
        "One or more issues prevented this transaction from being successful"
      );
    }
  }, [transactionContext?.content, transactionContext?.state]);

  const accountAddress = useMemo(() => {
    return web3Context.account;
  }, [web3Context.account]);

  return (
    <Modal
      title={null}
      footer={null}
      open={open}
      width={580}
      onCancel={() => onOpen(false)}
      maskClosable={false}
      className={"relative max-w-[420px] "}
      closable={false}
      styles={{
        content: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
        },
        body: {
          padding: 0,
        },
      }}
      zIndex={2000}
    >
      {transactionContext?.isPaid && transactionContext?.state !== "success" ? (
        <TransactionDialogBoxPaid
          transactionContext={transactionContext}
          onOpen={onOpen}
        />
      ) : (
        <div className="absolute top-[75px] right-0 bottom-0 left-0 bg-neutral-greys-0 border border-neutral-greys-200 rounded-[20px] shadow2 h-fit px-[16px] py-[16px] transaction_dialog_v2  ">
          <div className="flex flex-row justify-end">
            {transactionContext?.state !== "confirm" && (
              <button className="" type="button" onClick={() => onOpen(false)}>
                {" "}
                <CrossIcon className="h-[20px] w-[20px] text-neutral-greys-950" />
              </button>
            )}
          </div>
          <div className={`flex flex-col items-center gap-y-[16px]  `}>
            <div className={classNames(["title_icon", titleIcon])} />
            <div
              className={`typo-b2-semiBold text-neutral-greys-800 ${(transactionContext?.state === "success" &&
                  transactionContext?.content === "Create Team") ||
                  transactionContext?.content === "Update team"
                  ? "max-w-[200px] mx-auto text-center"
                  : ""
                }`}
            >
              {title}
            </div>
          </div>
          <p
            className={`typo-b3-regular text-neutral-greys-500   text-center   mx-auto ${content === "Don’t worry you won’t be charged gas fee." ? "mt-[4px] max-w-[280px]" : "mt-[27px] max-w-[240px]"}`}
          >
            <span>{content}</span>{" "}
            {content === "Don’t worry you won’t be charged gas fee." && (
              <span
                className="underline select-none text-primary-main-500 typo-b3-regular"
                onClick={() =>
                  window?.open(
                    "https://docs.chaquen.io/earlyfans-program",
                    "_blank"
                  )
                }
              >
                Learn more
              </span>
            )}
          </p>
          <ConditionDisplay
            display={transactionContext?.state === "confirm" && accountAddress}
          >
            <div className="border border-neutral-greys-200 rounded-[90px] py-[8px] px-[12px] flex flex-row justify-between items-center mt-4 ">
              <div className="flex flex-row items-center gap-x-[6px]">
                <img
                  src={`/assets/wallets/${connectedWalletName
                    .replace(/ /g, "")
                    .toLowerCase()}.svg`}
                  alt=""
                  className="h-[24px] w-[24px] hidden"
                />{" "}
                <p className={"typo-b2-semiBold text-neutral-greys-500"}>
                  {generateAddressSummary(accountAddress, 6)}
                </p>
              </div>
              <div className="bg-neutral-greys-200 py-[4px] pl-[8px] pr-[12px] rounded-[90px]">
                <i className="i_icon_a w-[10px] h-[10px] rounded-full bg-system-success-500 mr-4" />
                <span className="typo-b3-regular text-neutral-greys-950">
                  Connected
                </span>
              </div>
            </div>
          </ConditionDisplay>

          <ConditionDisplay display={confirmed}>
            <div className="bg-neutral-greys-0 p-6  flex-col items-center rounded-[10px] hidden">
              <div className="typo-b1-regular text-neutral-greys-500">
                {generateAddressSummary(accountAddress, 6)}
              </div>
              <div className="flex flex-row gap-[12px] mt-4">
                <ViewOnEtherscan
                  url={`${ContractConfig.etherscan(web3Context.chainId)}/tx/${transactionContext?.hash}`}
                  showTitle={true}
                />
              </div>
            </div>
            <ConditionDisplay
              display={
                !transactionContext?.error &&
                transactionContext?.content !== "Create Team" &&
                transactionContext?.content !== "Update team"
              }
            >
              <Button
                title="Continue"
                type={ButtonTypesEnum.PRIMARY}
                isFullWidth={true}
                classname="flex flex-row justify-center h-[48px] mt-10 rounded-[90px]"
                onClick={() => {
                  onClose();
                }}
              />
            </ConditionDisplay>
            <ConditionDisplay
              display={
                (!transactionContext?.error &&
                  transactionContext?.content === "Create Team") ||
                transactionContext?.content === "Update team"
              }
            >
              <div className="w-full">
                <Button
                  title="Continue"
                  type={ButtonTypesEnum.PRIMARY}
                  isFullWidth={true}
                  classname="flex flex-row justify-center h-[48px] mt-[16px] rounded-[90px]"
                  onClick={() => {
                    onClose();
                  }}
                />
                <button
                  className="mt-[12px] w-full rounded-[90px] text-center bg-neutral-greys-200 px-[16px] py-[16px] typo-b3-semiBold text-neutral-greys-950"
                  onClick={() =>
                    window?.open("https://t.me/chaquendiscussions", "_blank")
                  }
                >
                  Join telegram
                </button>
              </div>
            </ConditionDisplay>
          </ConditionDisplay>
          <ConditionDisplay
            display={
              transactionContext?.state === "failed" ||
              transactionContext?.state === "rejected"
            }
          >
            <Button
              title="Continue"
              type={ButtonTypesEnum.PRIMARY}
              isFullWidth={true}
              classname="flex flex-row justify-center h-[48px] mt-[16px] rounded-[90px]"
              onClick={() => {
                onClose();
              }}
            />
            <p className="text-neutral-greys-500 text-white mt-3 flex items-center justify-center flex-wrap text-[12px] gap-1 ">
              <InfoIcon className="text-neutral-greys-500 bg-none w-[18px] h-[18px]" /> Facing any issue in Chaquen
            </p>
          </ConditionDisplay>
        </div>
      )}
    </Modal>
  );
}
