// SSE Event from /llm/stream
export interface ToolDataEvent {
  type: "tool_data";
  toolName: string;
  executionId: string;
  summary: string;
  dataType: string;
  status: "pending" | "completed" | "failed";
}

// Response from /llm/toolData/:executionId
export interface ToolDataResponse {
  success: boolean;
  data?: {
    executionId: string;
    toolName: string;
    dataType: string;
    payload: any;
    summary: string;
    execution: {
      status: "pending" | "completed" | "failed";
      startedAt: Date;
      completedAt?: Date;
      error?: string;
    };
    createdAt: Date;
  };
  error?: string;
}

// Status poll response
export interface ToolDataStatusResponse {
  success: boolean;
  status?: "pending" | "completed" | "failed";
  completedAt?: Date;
  error?: string;
}

// Batch fetch result item
export interface ToolDataBatchItem {
  executionId: string;
  toolName: string;
  dataType: string;
  payload: any;
  summary: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

// Batch fetch response
export interface ToolDataBatchResponse {
  success: boolean;
  results?: {
    [executionId: string]: ToolDataBatchItem;
  };
  error?: string;
}

// Pending async data state for Redux
export interface PendingAsyncData {
  executionId: string;
  toolName: string;
  dataType: string;
  summary: string;
  status: "pending" | "completed" | "failed";
  error?: string;
}
