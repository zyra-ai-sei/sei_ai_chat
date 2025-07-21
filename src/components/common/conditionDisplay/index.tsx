import { FixTypeLater } from "../../../interface/common.interface";

const ConditionDisplay = ({ display, children }: FixTypeLater) => {
  return display ? children : "";
};

export default ConditionDisplay;
