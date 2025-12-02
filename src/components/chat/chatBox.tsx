import React from "react";
import InputBox from "../common/inputBox";
import ChatInterfaceBox from "../common/responseBox/ChatInterfaceBox";


const ChatBox = React.forwardRef<HTMLDivElement, { width: number }>(
  ({ width }, ref) => {
    return (
      <div
        ref={ref}
        style={{ width: `${100 - width}%` }}
        className="bg-background-2 max-h-[calc(100%)] flex flex-col relative"
      >
        <div className="flex-grow overflow-hidden text-white">
          <ChatInterfaceBox />
        </div>

        <div className="flex-shrink-0 w-full p-4 bg-background-secondary">
          <InputBox />
        </div>
      </div>
    );
  }
);

export default ChatBox;
