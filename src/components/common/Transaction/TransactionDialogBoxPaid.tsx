/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CrossIcon from "../../../assets/popup/cross.svg?react";
import { classNames } from "@/utility/className";
import CheckIcon from "@/assets/refer/checkCurrent.svg?react";
import ApprovePendingIcon from "@/assets/refer/pendingCurrent.svg?react";
import ConditionDisplay from "../conditionDisplay";

function TransactionDialogBoxPaid({
  transactionContext,
  onOpen,
}: {
  transactionContext: any;
  onOpen: any;
}) {
  const [titleIcon, setTitleIcon] = useState("title_icon_confirm");
  const [isApproveSuccess, setIsApproveSuccess] = useState<boolean>(false);

  const [content, setContent] = useState(
    "Confirm the transaction from your wallet"
  );

  const onClose = () => {
    onOpen(false);
  };

  useEffect(() => {
    if (transactionContext?.txType === "REC20") {
      if (transactionContext?.state === "approve_confirm") {
        setTitleIcon("title_icon_pending");

        setTitleIcon("title_icon_confirm");
      } else if (transactionContext?.state === "approve_success") {
        setIsApproveSuccess(true);
      } else if (transactionContext?.state === "approve_failed") {
        setIsApproveSuccess(false);
        setTitleIcon("title_icon_failed");
      } else {
        setIsApproveSuccess(false);
      }
    } else {
      setIsApproveSuccess(true);
      if (transactionContext?.state === "confirm") {
        setTitleIcon("title_icon_confirm");
        setContent("Confirm the transaction from your wallet");
      }

      if (transactionContext?.state === "pending") {
        setTitleIcon("title_icon_pending");
        setContent("Confirm the transaction from your wallet");
      }

      if (transactionContext?.state === "success") {
        setTitleIcon("title_icon_team_success");

        setContent("Confirm the transaction from your wallet");
      }

      if (transactionContext?.state === "failed") {
        setTitleIcon("title_icon_failed");

        setContent("Confirm the transaction from your wallet");
      }

      if (transactionContext?.state === "rejected") {
        setTitleIcon("title_icon_failed");

        setContent("Confirm the transaction from your wallet");
      }
    }
  }, [
    transactionContext?.content,
    transactionContext?.state,
    transactionContext?.txType,
  ]);

  return (
    <div className="absolute top-[75px] right-0 bottom-0 left-0 bg-neutral-greys-0 border border-neutral-greys-200 rounded-[20px] shadow2 h-fit px-[16px] py-[16px] transaction_dialog_v2  ">
      <div className="flex flex-row justify-end">
        {transactionContext?.state !== "confirm" &&
          transactionContext?.state !== "approve_confirm" && (
            <button className="" type="button" onClick={() => onOpen(false)}>
              {" "}
              <CrossIcon className="h-[20px] w-[20px] text-neutral-greys-950" />
            </button>
          )}
      </div>
      <div className={`flex flex-col items-center gap-y-[16px]  `}>
        <div className={classNames(["title_icon", titleIcon])} />

        <p className="typo-b2-semiBold text-neutral-greys-950 max-w-[185px] text-center">
          {content}
        </p>
      </div>
      <section className="px-[12px] py-[12px] rounded-[16px] border-[1px] border-solid border-neutral-greys-200 w-[243px] mx-auto mt-[24px] flex flex-col gap-y-[8px]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-[4px]">
            <p className="typo-b3-regular text-neutral-greys-500">Approve</p>
            <ConditionDisplay
              display={
                transactionContext?.state !== "approve_confirm" &&
                !isApproveSuccess
              }
            >
              <p className="text-system-warning-500 typo-c1-regular py-[2px]  px-[8px] rounded-[90px] bg-system-warning-50 ">
                Failed
              </p>
            </ConditionDisplay>
          </div>

          <ConditionDisplay
            display={transactionContext?.state === "approve_confirm"}
          >
            <ApprovePendingIcon className="h-[24px] w-[24px] animate-spin  text-system-success-500" />
          </ConditionDisplay>
          <ConditionDisplay
            display={
              transactionContext?.state == "approve_failed" && !isApproveSuccess
            }
          >
            <ApprovePendingIcon
              className="h-[24px] w-[24px]  text-system-success-500"
              onClick={() => {
                onClose();
              }}
            />
          </ConditionDisplay>

          <ConditionDisplay
            display={
              transactionContext?.state === "approve_success" ||
              transactionContext?.txType !== "REC20"
            }
          >
            <CheckIcon className=" h-[24px] w-[24px] text-system-success-500" />
          </ConditionDisplay>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-[4px]">
            <p className="typo-b3-regular text-neutral-greys-500">Transfer</p>
            <ConditionDisplay
              display={
                transactionContext?.state === "failed" ||
                transactionContext?.state === "rejected"
              }
            >
              <p className="text-system-warning-500 typo-c1-regular py-[2px]  px-[8px] rounded-[90px] bg-system-warning-50 ">
                Failed
              </p>
            </ConditionDisplay>
          </div>

          {(transactionContext?.state === "confirm" ||
            transactionContext?.state === "pending") && (
            <ApprovePendingIcon className="h-[24px] w-[24px] animate-spin text-system-success-500" />
          )}
          {transactionContext?.state === "success" && (
            <CheckIcon className=" h-[24px] w-[24px] text-system-success-500" />
          )}
          <ConditionDisplay
            display={
              transactionContext?.state === "failed" ||
              transactionContext?.state === "rejected"
            }
          >
            <ApprovePendingIcon
              className="h-[24px] w-[24px] text-system-success-500"
              onClick={() => onClose()}
            />
          </ConditionDisplay>
        </div>
      </section>
    </div>
  );
}

export default TransactionDialogBoxPaid;
