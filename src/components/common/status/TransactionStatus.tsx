import { StatusEnum } from "@/enum/status.enum";

const TransactionStatus = ({ status }: { status: StatusEnum }) => {
  const statusProps = {
    pending: {
      bgColor: "rgba(250, 201, 7, 0.1)",
      textColor: "#FAC907",
    },
    success: {
      bgColor: "rgba(35, 196, 59, 0.1)",
      textColor: "#23C43B",
    },
    error: {
      bgColor: "rgba(245, 73, 39, 0.1)",
      textColor: "#F54927",
    },
  };
  return (
    <h1
      className={`rounded-full py-2 px-4 font-thin text-[12px]`}
      style={{
        backgroundColor: statusProps[status].bgColor,
        color: statusProps[status].textColor,
      }}
    >
      {status.toLocaleUpperCase()}
    </h1>
  );
};

export default TransactionStatus;
