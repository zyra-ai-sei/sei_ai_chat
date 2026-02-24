import { LLMResponseEnum } from "@/enum/llm.enum";
import { StatusEnum } from "@/enum/status.enum";

// Map executionStatus from API to StatusEnum
const mapExecutionStatus = (
  executionStatus: string | undefined,
): StatusEnum | undefined => {
  if (!executionStatus) return undefined;
  switch (executionStatus.toLowerCase()) {
    case "completed":
      return StatusEnum.SUCCESS;
    case "failed":
      return StatusEnum.ERROR;
    case "pending":
      return StatusEnum.PENDING;
    case "unsigned":
      return StatusEnum.IDLE;
    default:
      return undefined;
  }
};

export const formatLLMResponse = (message: any, handleHumanMessage?: any) => {
  const type = message["type"];
  const content = message["content"];
  if (handleHumanMessage) {
    handleHumanMessage(content);
  }
  let response: any = {};
  if (type == LLMResponseEnum.HUMANMESSAGE) {
    response = {
      type: type,
      content: content,
    };
  }
  if (type == LLMResponseEnum.TOOLMESSAGE) {
    let rawToolOutput: any[] = [];

    if (message["tool_output"]) {
      rawToolOutput = message["tool_output"];
    } else if (message["result"]) {
      const result = message["result"];
      if (result.kind === "transaction" && result.transactions) {
        rawToolOutput = result.transactions.map((tx: any, idx: number) => ({
          id: idx + 1,
          label: tx.label || result.toolName || `Transaction #${idx + 1}`,
          transaction: {
            to: tx.to,
            data: tx.data,
            value: tx.value,
            chainId: tx.chainId,
          },
          metadata: tx.meta || {},
          metaData: tx.meta || {},
          executionId: result.executionId,
          type: result.toolName,
          executionStatus: tx.status || result.transactionStatus || "unsigned",
          transactionIndex: idx,
        }));
      }
    }

    if (rawToolOutput && rawToolOutput.length > 0) {
      const processedToolOutput = rawToolOutput.map((tool: any) => ({
        ...tool,
        status: mapExecutionStatus(tool.executionStatus),
        txHash: tool.txnHash || tool.txHash,
      }));

      response = { ...response, type: type, tool_output: processedToolOutput };
    }

    if (message["data_output"]) {
      response = {
        ...response,
        type: type,
        data_output: message["data_output"],
      };
    }
  }
  if (
    type == LLMResponseEnum.AIMESSAGE ||
    type == LLMResponseEnum.AIMESSAGECHUNK
  ) {
    // For AI messages, content might also be an object with "text" property
    let textContent = "";
    if (typeof content === "object" && content !== null) {
      textContent = content.text || "";
    } else if (typeof content === "string") {
      textContent = content;
    }

    response = {
      ...response,
      type: type,
      content: textContent,
    };
  }
  return response;
};
