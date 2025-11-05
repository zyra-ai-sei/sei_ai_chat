import React from "react";
import InputBox from "../common/inputBox";
import ResponseBox from "../common/responseBox/ChatInterfaceBox";
import ChatInterfaceBox from "../common/responseBox/ChatInterfaceBox";

const ChatBox = React.forwardRef<HTMLDivElement, { width: number }>(
  ({ width }, ref) => {
    return (
      <div
        ref={ref}
        style={{ width: `${100 - width}%` }}
        className="overflow-auto bg-background-2 max-h-[calc(100%)] flex flex-col"
      >
        <div className="flex-grow overflow-scroll text-white">
         <ChatInterfaceBox/>
        </div>

        <div className="w-full p-4 bg-background-secondary">
          <InputBox />
        </div>
      </div>
    );
  }
);

export default ChatBox;
