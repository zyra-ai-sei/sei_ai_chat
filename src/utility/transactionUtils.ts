import { ToolOutput } from "@/redux/chatData/reducer";

export const getTxnNetwork = (txn: ToolOutput) => {
  return txn.type === "bridge" ? txn.metaData?.network : txn?.metadata?.network;
};

export const getTxnFunction = (txn: ToolOutput) => {
  return txn.type === "bridge" 
    ? (txn.metaData?.function || "Bridge") 
    : (txn?.transaction?.functionName || "Contract Call");
};
