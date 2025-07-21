/* eslint-disable react-hooks/exhaustive-deps */
import { useAlert } from "@/hooks/useAlert";
import { useEffect, useState } from "react";
import { FixTypeLater } from "react-redux";
import { twMerge } from "tailwind-merge";
const dismissTime = 3000;

type ToastProps = {
  id?: number;
};
const Toast = (props: ToastProps) => {
  const randomId = Math.floor(Math.random() * 101 + 1).toString();
  const { id = randomId } = props;

  const [toastList, setToastList] = useState<FixTypeLater[]>([]);
  const { state, dispatch } = useAlert();

  useEffect(() => {
    if (state.type && state.title) {
      setToastList((toasts) => [...toasts, { ...state, id }]);
    }
  }, [state.title, state.type]);
  const clearAlert = () => {
    dispatch({ type: "CLEAR", payload: { title: "", message: "" } });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastList.length) {
        deleteToast(toastList[0].id as FixTypeLater);
        clearAlert();
      }
    }, dismissTime);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line
  }, [toastList, dismissTime]);

  const deleteToast = (id: string) => {
    const toastListIndex = toastList.findIndex((e) => e.id === id);
    toastList.splice(toastListIndex, 1);
    setToastList([...toastList]);
  };

  const getClassNamesWithType = (type: string) => {
    switch (type) {
      case "success":
        return { bg: "bg-system-success-500", icon: "i_toast_check" };
      case "warning":
        return { bg: "bg-system-warning-500", icon: "i_toast_info" };
      case "error":
        return { bg: "bg-system-error-500", icon: "i_toast_alert" };
      case "loader":
        return { bg: "bg-neutral-greys-950", icon: "i_toast_loader" };
      case "info":
        return { bg: "bg-neutral-greys-950", icon: "i_toast_info" };

      default:
        return { bg: "bg-neutral-greys-950", icon: "i_toast_info" };
    }
  };
  return (
    <div className="flex flex-col gap-3 fixed top-10 right-0 left-0 mx-auto z-[9999] w-fit  px-[16px]">
      {toastList.map((toast: FixTypeLater, index) => (
        <div
          className={twMerge([
            "bg-system-success-500 flex flex-row items-center justify-between  h-[44px] rounded-[12px] p-3 z-[99] w-[100%] ",
            getClassNamesWithType(toast.type)?.bg,
          ])}
          key={index}
        >
          <div className="flex flex-row items-center gap-2">
            <div
              className={twMerge([
                "i_icon_20 i_toast_check",
                getClassNamesWithType(toast.type)?.icon,
              ])}
            />
            <div className="typo-b3-semiBold text-neutral-greys-0">
              {toast.title}
            </div>
          </div>
          <div>
            <button onClick={() => deleteToast(toast.id)}>
              <i className="i_icon_a i_icon_20 i_toast_close" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
