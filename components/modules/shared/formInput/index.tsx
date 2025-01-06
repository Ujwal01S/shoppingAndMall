import { twMerge } from "tailwind-merge";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

interface FormInputProps {
  className?: string;
  label: string;
  register: UseFormRegister<{ [key: string]: unknown }>;
  name: string;
  validation?: RegisterOptions;
  type: string;
}

const FormInput = ({
  className,
  label,
  name,
  register,
  validation,
  type,
}: FormInputProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {label && <label>{label}</label>}
      <input
        className={twMerge(
          "border-[1px] rounded w-full py-3 focus:border-none focus:ring-0",
          className
        )}
        placeholder="Placeholder.."
        type={type}
        {...register(name, validation)}
      />
    </div>
  );
};

export default FormInput;
