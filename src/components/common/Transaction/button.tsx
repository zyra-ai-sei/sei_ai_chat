import { ButtonTypesEnum } from './buttonType.enum';

function Button({
    type = ButtonTypesEnum.PRIMARY,
    title,
    isFullWidth,
    isDisabled,
    onClick,
    classname = '',
    isActive,
    isUnderLine,
    leftIcon,
    rightIcon,
    isSmallsize,
}: {
    type: ButtonTypesEnum;
    title: string;
    isFullWidth?: boolean;
    isDisabled?: boolean;
    isActive?: boolean;
    isUnderLine?: boolean;
    onClick?: () => void;
    classname?: string;
    leftIcon?: string;
    rightIcon?: string;
    isSmallsize?: boolean;
}) {
    if (type === ButtonTypesEnum.PRIMARY) {
        return (
            <button
                type="button"
                disabled={isDisabled}
                onClick={() => onClick?.()}
                className={` ${
                    isSmallsize ? 'py-[10px] px-[12px]' : 'py-[12px] px-[20px]'
                }  bg-primary-main-500 text-neutral-greys-100 typo-b2-semiBold rounded-[10px] flex items-center  gap-x-[8px] ${
                    isFullWidth ? 'w-full justify-center' : ''
                }   ${
                    isDisabled ? 'bg-system-error-100 pointer-events-none' : ''
                } hover:bg-primary-main-400 ${classname} `}
            >
                {leftIcon && <span className={`${leftIcon} h-[20px] w-[20px] `} />}
                <span>{title}</span>
                {rightIcon && <span className={`${rightIcon} h-[20px] w-[20px]`} />}
            </button>
        );
    } else if (type === ButtonTypesEnum.SECONDARY) {
        return (
            <button
                type="button"
                onClick={() => onClick?.()}
                disabled={isDisabled}
                className={` ${
                    isSmallsize ? 'py-[10px] px-[12px]' : 'py-[12px] px-[20px]'
                }  bg-neutral-greys-200  typo-b2-semiBold rounded-[10px] border-[1px] border-solid  flex items-center gap-x-[8px] ${
                    isFullWidth ? 'w-full' : ''
                }   ${
                    isDisabled ? ' pointer-events-none text-neutral-greys-500' : 'text-neutral-greys-950'
                } hover:bg-neutral-greys-200 hover:text-primary-main-500 ${
                    isActive ? 'text-primary-main-500 border-primary-main-500' : 'border-neutral-greys-300'
                } ${classname} `}
            >
                {leftIcon && !isActive && (
                    <span className={`${isDisabled ? `${leftIcon}_disabled` : leftIcon} h-[20px] w-[20px]`} />
                )}
                {leftIcon && isActive && (
                    <span className={`${isActive ? `${leftIcon}_active` : leftIcon} h-[20px] w-[20px]`} />
                )}
                <span>{title}</span>
                {rightIcon && !isActive && (
                    <span className={`${isDisabled ? `${rightIcon}_disabled` : rightIcon} h-[20px] w-[20px]`} />
                )}
                {rightIcon && isActive && (
                    <span className={`${isActive ? `${rightIcon}_active` : rightIcon} h-[20px] w-[20px]`} />
                )}
            </button>
        );
    } else {
        return (
            <button
                type="button"
                onClick={() => onClick?.()}
                disabled={isDisabled}
                className={` typo-b2-semiBold rounded-[10px]    ${
                    isDisabled ? 'text-neutral-greys-500 pointer-events-none' : 'text-primary-main-500'
                } hover:text-primary-main-400 ${isUnderLine ? 'underline' : ''} ${classname} `}
            >
                {title}
            </button>
        );
    }
}

export default Button;
