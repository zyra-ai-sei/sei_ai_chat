import React, { useState } from "react";
import { Tooltip } from "antd";

interface ClickToCopyProps {
  textToCopy: string;
  children: React.ReactNode;
  className?: string;
  tooltipText?: string;
}

const ClickToCopy: React.FC<ClickToCopyProps> = ({
  textToCopy,
  children,
  className = "",
  tooltipText = "Copied!",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tooltip
      title={tooltipText}
      trigger="click"
      open={isCopied}
      placement="top"
      overlayInnerStyle={{ borderRadius: 6 }}
    >
      <div className={`w-fit h-fit cursor-pointer ${className}`} onClick={handleCopy}>
        {children}
      </div>
    </Tooltip>
  );
};

export default ClickToCopy;
