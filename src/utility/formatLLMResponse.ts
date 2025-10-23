import { LLMResponseEnum } from "@/enum/llm.enum";

export const formatLLMResponse = (
  message: any,
  handleHumanMessage?: any,
  handleAIMessage?: any,
  handleToolMessage?: any
) => {
  const type = message["type"];
  const content = message["content"];
  const tool_output = message["tool_output"];
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
    response = {
      type: type,
      content,
      tool_output,
    };
  }
  if (type == LLMResponseEnum.AIMESSAGE || type == LLMResponseEnum.AIMESSAGECHUNK) {
    response = {
      type: type,
      content,
    };
  }
  return response;
};
