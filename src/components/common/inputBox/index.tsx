import { useAppDispatch } from "@/hooks/useRedux";
import { sendChatPrompt } from "@/redux/chatData/action";
import React, { useRef, useState } from "react";

const InputBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setPrompt(e.target.value);
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const dispatch = useAppDispatch();

  const handleSendPromt = async () => {
    if (prompt.trim() === "") return;
    dispatch(sendChatPrompt({ prompt }));
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "20px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPromt();
    }
  };

  return (
    <div className="w-full p-[1px] flex flex-col  max-h-[400px] rounded-3xl bg-gradient-to-r from-[#F44E4E] via-[#E76EF2] to-[#4CBEE1]">
      <div className="flex flex-col items-end w-full p-2 mx-auto rounded-3xl bg-[#0F172A] ">
        <textarea
          ref={textareaRef}
          className="flex-grow w-full rounded-2xl min-h-[60px] max-h-[200px] resize-none overflow-y-auto bg-transparent border-none outline-none text-white placeholder-white/50 p-3"
          placeholder="Type your message..."
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          value={prompt}
          style={{ height: "20px" }}
        />
        <button
          onClick={handleSendPromt}
          className="w-[40px] h-[40px] border border-white/10 bg-[#3B82F6] rounded-full"
        >
          <span className="text-[24px] text-white">↑</span>
        </button>
      </div>
    </div>
  );
};

export default InputBox;
