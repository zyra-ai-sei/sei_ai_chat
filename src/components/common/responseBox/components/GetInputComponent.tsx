// Add this import for the new component
import DateTimeInput from "../../input/DateTimeInput";
import TextInput from "../../input/TextInput";
import TokenListInput from "../../input/TokenListInput";

interface InputComponentProps {
  type: string;
  title: string;
  val: string;
  onChange: (value: string) => void;
  className?: string;
}

const GetInputComponent: React.FC<InputComponentProps> = ({
  type,
  title,
  val,
  onChange,
  className = ""
}) => {
  switch (type) {
    case "Date":
      return (
        <DateTimeInput
          title={title}
          val={val}
          onChange={onChange}
          className={className}
        />
      );
    case "erc20":
      return (
        <TokenListInput
          title={title}
          val={val}
          onChange={onChange}
          className={className}
        />
      );
    default:
      return (
        <TextInput
          title={title}
          val={val}
          onChange={onChange}
          className={className}
        />
      );
  }
};

export default GetInputComponent;