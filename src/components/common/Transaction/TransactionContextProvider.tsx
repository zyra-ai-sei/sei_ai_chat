import { useMemo, useReducer, useState, useEffect } from "react";
import TransactionContext from "./TransactionContext";
import { TransactionDialogBox } from "./TransactionDialogBox";
import { FixTypeLater } from "react-redux";

const defaultTransactionInfo = {
  state: "", // transaction state: [confirm|pending|success|failed|rejected]
  content: "",
  hash: "",
  onSuccess: () => {},
  onFailure: () => {},
  isPaid: false,
};

const convertTransactionStateToTransactionInfo = (state: FixTypeLater) => {
  let transactionInfo = {};

  const txContent = state?.txContent || "";
  const txType = state?.txType || "";
  const isPaid = state?.isPaid || false;

  //   const msg = state?.errorMessage || "";

  if (isPaid) {
    if (txType === "REC20") {
      if (state?.status === "submit" || state?.status === "loading") {
        transactionInfo = {
          state: "approve_confirm",
          content: txContent,
          txType: txType,
          isPaid,
        };
      } else if (state?.status === "success") {
        transactionInfo = {
          state: "approve_success",
          content: txContent,
          txType: txType,
          onSuccess: state?.onSuccess,
          hash: state?.hash || "",
          isPaid,
        };
      } else if (state?.status === "error") {
        transactionInfo = {
          state: "approve_failed",
          content: txContent,
          txType: txType,
          onFailure: state?.onFailure,
          hash: state?.hash || "",
          isPaid,
        };
      } else if (state?.status === "idle") {
        transactionInfo = {
          state: "",
          content: "",
          txType: "",
          hash: "",
          isPaid,
        };
      } else {
        transactionInfo = {
          state: "",
          content: "",
          txType: "",
          hash: "",
          onSuccess: state?.onSuccess,
          isPaid,
        };
      }
    } else {
      switch (state?.status) {
        case "submit":
        case "loading":
          transactionInfo = {
            state: "confirm",
            content: txContent,
            txType: txType,
            isPaid,
          };
          break;
        // case 'loading':
        // case 'idle':
        //     transactionInfo = {
        //         state: 'pending',
        //         content: txContent,
        //         txType: txType,
        //         hash: state?.hash || '',
        //     };
        //     break;
        case "success":
          transactionInfo = {
            state: "success",
            content: txContent,
            txType: txType,
            hash: state?.hash || "",
            onSuccess: state?.onSuccess,
            isPaid,
          };
          break;
        case "error":
          transactionInfo = {
            state: "failed",
            content: txContent,
            txType: txType,
            hash: state?.hash || "",
            onFailure: state?.onFailure,
            isPaid,
          };
          break;

        case "idle":
          transactionInfo = {
            state: "",
            content: "",
            txType: "",
            hash: "",
            isPaid,
          };
          break;

        default:
          transactionInfo = {
            state: "",
            content: "",
            txType: "",
            hash: "",
            isPaid,
          };
      }
    }
  } else {
    switch (state?.status) {
      case "submit":
      case "loading":
        transactionInfo = {
          state: "confirm",
          content: txContent,
          txType: txType,
        };
        break;
      // case 'loading':
      // case 'idle':
      //     transactionInfo = {
      //         state: 'pending',
      //         content: txContent,
      //         txType: txType,
      //         hash: state?.hash || '',
      //     };
      //     break;
      case "success":
        transactionInfo = {
          state: "success",
          content: txContent,
          txType: txType,
          hash: state?.hash || "",
          onSuccess: state?.onSuccess,
        };
        break;
      case "error":
        transactionInfo = {
          state: "failed",
          content: txContent,
          txType: txType,
          hash: state?.hash || "",
          onFailure: state?.onFailure,
        };
        break;

      case "idle":
        transactionInfo = {
          state: "",
          content: "",
          txType: "",
          hash: "",
        };
        break;

      default:
        transactionInfo = {
          state: "",
          content: "",
          txType: "",
          hash: "",
        };
    }
  }

  return transactionInfo;
};

const reducer = (state: FixTypeLater, action: FixTypeLater) => {
  // console.debug(`transaction state => `, action);
  const transactionInfo: FixTypeLater =
    convertTransactionStateToTransactionInfo(action);
  return state.state === transactionInfo.state ? state : transactionInfo;
};

const TransactionContextProvider = (props: FixTypeLater) => {
  const [transactionInfo, dispatch] = useReducer(
    reducer,
    defaultTransactionInfo
  );
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  const contextWrapper: FixTypeLater = useMemo(
    () => ({
      transactionInfo: transactionInfo,
      dispatch: dispatch,
    }),
    [transactionInfo]
  );

  useEffect(() => {
    if (transactionInfo.state) {
      setOpenTransactionModal(true);

      if (
        transactionInfo.state === "success" ||
        transactionInfo?.state === "approve_success"
      ) {
        transactionInfo.onSuccess && transactionInfo.onSuccess();
      }
      if (transactionInfo.state === "failed") {
        transactionInfo.onFailure && transactionInfo.onFailure();
      }
    }
  }, [transactionInfo]);

  return (
    <TransactionContext.Provider value={contextWrapper}>
      <TransactionDialogBox
        open={openTransactionModal}
        onOpen={setOpenTransactionModal}
        transactionContext={transactionInfo}
      />
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionContextProvider;
