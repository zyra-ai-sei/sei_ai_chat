import { useAppDispatch } from "@/hooks/useRedux";
import { streamChatPrompt } from "@/redux/chatData/action";
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
    dispatch(streamChatPrompt({ prompt, abortSignal: new AbortController().signal }));
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
    <div className="w-full p-[2px] flex flex-col max-w-[1280px] mx-auto max-h-[400px] rounded-xl z-30">
      <div className="flex flex-col items-end w-full p-2 mx-auto rounded-xl bg-[#0f172a8c] ">
        <textarea
          ref={textareaRef}
          className="flex-grow w-full rounded-2xl min-h-[40px] max-h-[200px] resize-none bg-transparent scrollbar-none border-none outline-none text-white placeholder-white/50 p-3"
          placeholder="Type your message..."
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          value={prompt}
          style={{ height: "10px" }}
        />
        <button
          onClick={handleSendPromt}
          className="w-[40px] h-[40px]  bg-[#7441f493] rounded-full"
        >
          <span className="text-[24px] text-white/70">↑</span>
        </button>
      </div>
    </div>
  );
};

export default InputBox;
