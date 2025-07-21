import PlusIcon from "@/assets/allContest/plus.svg?react";
import MinusIcon from "@/assets/allContest/minusCurrent.svg?react";
import React, { useEffect, useRef, useState } from "react";
import NumberFlow from '@number-flow/react';
import clsx from 'clsx/lite'
function NumberInputRamp({
  currencyLogo,
  minValue,
  maxValue,
  value,
  setValue,
}: {
  currencyLogo?: string;
  minValue: number;
  maxValue: number;
  value: number;
  setValue: (value: number) => void;
}) {
  const [errorState, setErrorState] = useState<{
    display: boolean;
    message: string;
  }>({ display: false, message: "" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [animated, setAnimated] = useState<boolean>(true);
  const [showCaret, setShowCaret] = useState<boolean>(true);

  const handlePointrDown = (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
    setAnimated(true);
    if (event.pointerType === 'mouse') {
      event?.preventDefault();
      inputRef.current?.focus()
    }
    const newVal = Math.min(Math.max(value + diff, minValue), maxValue)
    setValue?.(newVal)
  }

  useEffect(() => {
    if (value < minValue) {
      setErrorState({
        display: true,
        message: `Minimum ${currencyLogo ? "entry fee" : "teams"}  should be ${minValue} ${currencyLogo ? "USDT" : ""} `,
      });
    } else if (value > maxValue) {
      setErrorState({
        display: true,
        message: `Maximum ${currencyLogo ? "entry fee" : "teams"} should be ${maxValue} ${currencyLogo ? "USDT" : ""} `,
      });
    } else {
      setErrorState({
        display: false,
        message: `Maximum ${currencyLogo ? "entry fee" : "teams"} should be ${maxValue} ${currencyLogo ? "USDT" : ""} `,
      });
    }
  }, [currencyLogo, maxValue, minValue, value]);
  return (
    <div>
      <div className="rounded-[16px] bg-neutral-greys-100 py-[13px] px-[16px] w-full flex items-center justify-between">
        <button
          className={`rounded-[50%] h-[34px] w-[34px] bg-neutral-greys-200 flex items-center justify-center text-neutral-greys-950 ${value > minValue ? "opacity-100" : "opacity-40"} `}
          disabled={value < minValue}
          // onClick={() => {
          //   if (value > minValue) {
          //     setValue(value - 1);
          //   }
          // }}
          onPointerDown={handlePointrDown(-1)}
        >
          <MinusIcon className="h-[20px] w-[20px]" />
        </button>
        <div className=" relative flex items-center border-b-[1px] border-solid border-neutral-greys-300">
          {currencyLogo && (
            <img src={currencyLogo} alt="" className="h-[20px] w-[20px] mb-2" />
          )}
          <div className="min-w-[72px] pb-2 relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap] ">
            <input
              ref={inputRef}
              type="number"
              name=""
              id=""
              value={value}
              style={{ fontKerning: 'none' }}
              onChange={(e) => {
                setAnimated(false)
                let inputValue = e.target.value;

                // Remove leading zeros, but allow a single "0" as input
                if (inputValue.startsWith("0") && inputValue.length > 1) {
                  inputValue = inputValue.replace(/^0+/, "");
                }

                if (inputValue === "") {
                  setValue(0);
                } else {
                  setValue(Number(inputValue));
                }
              }}
              className={clsx(showCaret ? 'caret-white' : 'caret-transparent', `spin-hide focus:outline-none cursor-text font-[inherit] bg-transparent outline-none  typo-b2-regular w-[60px] text-center`)}
            />
            <NumberFlow
              value={value}
              locales="en-US"
              format={{ useGrouping: false }}
              aria-hidden="true"
              animated={animated}
              onAnimationsStart={() => setShowCaret(false)}
              onAnimationsFinish={() => setShowCaret(true)}
              className={` pointer-events-none text-neutral-greys-950 typo-b2-regular text-center w-[60px] cursor-text overflow-hidden`}
              willChange
              onClick={() => { inputRef.current?.focus() }}
            />
          </div>
        </div>
        <button
          className={`rounded-[50%] h-[34px] w-[34px] bg-neutral-greys-200 flex items-center justify-center text-neutral-greys-950 ${maxValue > value ? "opacity-100" : "opacity-40"} `}
          disabled={value > maxValue}
          // onClick={() => {
          //   if (maxValue > value) {
          //     setValue(value + 1);
          //   }
          // }}
          onPointerDown={handlePointrDown(1)}

        >
          <PlusIcon className="h-[20px] w-[20px]" />
        </button>
      </div>

      <p
        className={`mt-2 text-system-warning-500 typo-b3-regular ${errorState?.display ? "block" : "invisible"}`}
      >
        {errorState?.message}
      </p>
    </div>
  );
}

export default NumberInputRamp;
