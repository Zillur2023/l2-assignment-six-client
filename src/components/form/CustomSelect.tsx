/* eslint-disable @typescript-eslint/no-unused-vars */
import { IInput } from "@/type";
import { Select, SelectItem } from "@nextui-org/select";
import { useFormContext } from "react-hook-form";

// import { IInput } from "@/src/types";

interface IProps extends IInput {
  // options: {
  //   uid: string;
  //   name: string;
  // }[];
  options: string[]
  value?: string
}

export default function CustomSelect({
  options,
  name,
  label,
  variant = "bordered",
  disabled,
  value,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select
      {...register(name)}
      className="min-w-full sm:min-w-[225px]"
      isDisabled={disabled}
      label={label}
      variant={variant}
      value={value}
    >
      {options.map((option) => (
        <SelectItem key={option}>{option}</SelectItem>
      ))}
    </Select>
  );
}
