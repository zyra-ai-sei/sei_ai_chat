import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dropdown = ({
  list,
  value,
  name,
  onChange,
}: {
  list: any[];
  value?: any;
  name?: string;
  onChange: any;
}) => {
  return (
    <Select
      
      onValueChange={(e) => onChange(e)}
      defaultValue={value ? list[0][value] : list[0]}
    >
      <SelectTrigger className="w-[130px] rounded-full border capitalize border-white/10 bg-transparent text-white outline-none focus:ring-0 focus:ring-offset-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="capitalize bg-black border border-white/10">
        {list.map((item: any, index: number) => (
          <SelectItem
            key={index}
            value={value ? item[value] : item}
            className="font-sans text-white capitalize cursor-pointer focus:bg-white/10 focus:text-white"
          >
            {name ? item[name] : item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
