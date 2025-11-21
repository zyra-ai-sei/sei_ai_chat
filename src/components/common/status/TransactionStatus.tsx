import { StatusEnum } from "@/enum/status.enum";

const TransactionStatus = ({ status }: { status: StatusEnum }) => {
  const statusProps: Record<StatusEnum, { bgColor: string; textColor: string; label?: string }> = {
    [StatusEnum.PENDING]: {
      bgColor: "rgba(250, 201, 7, 0.1)",
      textColor: "#FAC907",
      label: "Pending",
    },
    [StatusEnum.SUCCESS]: {
      bgColor: "rgba(35, 196, 59, 0.1)",
      textColor: "#23C43B",
      label: "Success",
    },
    [StatusEnum.ERROR]: {
      bgColor: "rgba(245, 73, 39, 0.1)",
      textColor: "#F54927",
      label: "Failed",
    },
    [StatusEnum.SIMULATING]: {
      bgColor: "rgba(236, 201, 92, 0.2)",
      textColor: "#EAC33D",
      label: "Simulating",
    },
    [StatusEnum.SIMULATION_SUCCESS]: {
      bgColor: "rgba(66, 153, 225, 0.2)",
      textColor: "#7CABF9",
      label: "Simulation Passed",
    },
    [StatusEnum.SIMULATION_FAILED]: {
      bgColor: "rgba(253, 186, 116, 0.2)",
      textColor: "#F97316",
      label: "Simulation Failed",
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
      {statusProps[status].label || status.toLocaleUpperCase()}
    </h1>
  );
};

export default TransactionStatus;
