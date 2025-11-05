import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChatHistory } from "@/redux/chatData/action";
import React, { useEffect } from "react";
import TransactionCanvas from "./components/TransactionCanvas";

const TransactionResponseBox = () => {
  const chats = useAppSelector((data) => data.chatData.chats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChatHistory());
  }, []);
  return (
    <div className="relative z-30 flex flex-col justify-start flex-grow w-full gap-6 py-2 pr-4 mx-auto overflow-y-auto scrollbar-none">
      {chats.length > 0 &&
        chats.map((chat, idx) => (
          <React.Fragment key={idx}>
            <div>
              {chat?.response?.tool_outputs &&
                chat?.response?.tool_outputs.length > 0 && (
                  <TransactionCanvas
                    txns={chat.response.tool_outputs}
                    chatIndex={idx}
                  />
                )}
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

export default TransactionResponseBox;
