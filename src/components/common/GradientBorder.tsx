import React from "react";

interface GradientBorderProps {
  children: React.ReactNode;
  borderWidth?: number;
  borderRadius?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  className?: string;
  innerClassName?: string;
}

/**
 * GradientBorder Component
 * Creates a gradient border effect by using a parent div with gradient background
 * and a child div with padding to create the border appearance
 * 
 * @param children - Content to display inside the border
 * @param borderWidth - Width of the border in pixels (default: 2)
 * @param borderRadius - Border radius (default: "12px")
 * @param gradientFrom - Starting color of gradient (default: "#7CABF9")
 * @param gradientTo - Ending color of gradient (default: "#B37AE8")
 * @param gradientDirection - Direction of gradient (default: "to-r" for left to right)
 * @param className - Additional classes for outer container
 * @param innerClassName - Additional classes for inner content container
 */
const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  borderWidth = 2,
  borderRadius = "12px",
  gradientFrom = "#7CABF9",
  gradientTo = "#B37AE8",
  gradientDirection = "to-r",
  className = "",
  innerClassName = "",
}) => {
  return (
    <div
      className={`bg-gradient-${gradientDirection} from-[${gradientFrom}] to-[${gradientTo}] ${className}`}
      style={{borderRadius:`${borderRadius}`}}
    >
      <div
        className={`bg-[#1B1B1F] ${innerClassName}`}
        style={{
          borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
          margin:`${borderWidth}px`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GradientBorder;
