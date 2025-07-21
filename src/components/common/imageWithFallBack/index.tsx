import { useCallback, useEffect, useMemo, useState } from "react";
import placeholder from "@/assets/common/placeholder.svg";

interface ImageProps {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  isDisableRounded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

const ImageWithFallback: React.FC<ImageProps> = ({
  src,
  alt,
  placeholderSrc = placeholder,
  className,
  isDisableRounded,
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  //   const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  const handleImageError = useCallback(() => {
    // if (!imageLoadError) {
    //   setImageSrc(placeholderSrc);
    //   setImageLoadError(true);
    // }
    setImageSrc(placeholderSrc);
  }, [placeholderSrc]);
  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return useMemo(() => {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isDisableRounded ? "" : "rounded-[50%]"}  `}
        onError={handleImageError}
        onClick={(e) => onClick?.(e)}
      />
    );
  }, [alt, className, handleImageError, imageSrc, isDisableRounded, onClick]);
};

export default ImageWithFallback;
