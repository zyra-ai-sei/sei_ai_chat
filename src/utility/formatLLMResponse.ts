import { LLMResponseEnum } from "@/enum/llm.enum";
import { StatusEnum } from "@/enum/status.enum";

// Map executionStatus from API to StatusEnum
const mapExecutionStatus = (
  executionStatus: string | undefined
): StatusEnum | undefined => {
  if (!executionStatus) return undefined;
  switch (executionStatus.toLowerCase()) {
    case "completed":
      return StatusEnum.SUCCESS;
    case "failed":
      return StatusEnum.ERROR;
    default:
      return undefined;
  }
};

export const formatLLMResponse = (message: any, handleHumanMessage?: any) => {
  const type = message["type"];
  const content = message["content"];
  const tool_output = message["tool_output"];
  const data_output = message["data_output"];
  if (handleHumanMessage) {
    handleHumanMessage(content);
  }
  let response;
  if (type == LLMResponseEnum.HUMANMESSAGE)
    response = {
      type: type,
      content: content,
    };
  if (type == LLMResponseEnum.TOOLMESSAGE && message["tool_output"]) {
    // Process tool_output to map executionStatus to status
    console.log('tool_output',tool_output)
    const processedToolOutput = tool_output.map((tool: any) => ({
      ...tool,
      status: mapExecutionStatus(tool.executionStatus),
      txHash: tool.txnHash || tool.txHash,
    }));

    response = {
      type: type,
      tool_output: processedToolOutput,
    };
  }
  if (type == LLMResponseEnum.TOOLMESSAGE && message["data_output"]) {
    response = {
      type: type,
      data_output: data_output,
    };
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
      type: type,
      content: textContent,
    };
  }
  return response;
};
