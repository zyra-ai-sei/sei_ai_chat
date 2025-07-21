import "./index.scss";

function CheckboxCustom({
  id,
  onChange,
  checked,
}: {
  id: string;
  onChange?: () => void;
  checked: boolean;
}) {
  return (
    <input
      id={id}
      type="checkbox"
      onChange={() => onChange?.()}
      value=""
      checked={checked}
      className=" custom-checkbox w-[24px] h-[24px] rounded-[50%] text-primary-main-500  focus:outline-none"
    />
  );
}

export default CheckboxCustom;
