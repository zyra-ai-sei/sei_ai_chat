import React, { PropsWithChildren } from "react";
import { Tooltip } from "antd";
import "./index.scss";
declare type RenderFunction = () => React.ReactNode;
export declare type TooltipPlacement =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

interface Props {
  title: React.ReactNode | RenderFunction;
  position?: TooltipPlacement;
}

export const TooltipTitleBox = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode | JSX.Element;
}) => {
  return (
    <div
      className={`py-[8px] px-[10px] rounded-[10px]  bg-neutral-greys-100 ${className}`}
    >
      {children}
    </div>
  );
};

const TooltipCustom: React.FC<PropsWithChildren<Props>> = ({
  title,
  position = "bottom",
  children,
}) => {
  return (
    <Tooltip
      title={title}
      placement={position}
      key={new Date().getTime().toString()}
      overlayInnerStyle={{ borderRadius: 6, background: "f1f5f9" }}
      style={{ backgroundColor: "f1f5f9" }}
      arrowContent=""
    >
      <span> {children ? children : null}</span>
    </Tooltip>
  );
};

export default TooltipCustom;
