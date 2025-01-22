import { twMerge } from "tailwind-merge";
import { UseFormRegister, RegisterOptions, Path } from "react-hook-form";

interface FormInputProps<T extends Record<string, unknown>> {
  className?: string;
  label: string;
  register: UseFormRegister<T>;
  name: Path<T>; // Use Path<T> for compatibility with react-hook-form
  validation?: RegisterOptions<T, Path<T>>;
  type: string;
}

const FormInput = <T extends Record<string, unknown>>({
  className,
  label,
  name,
  register,
  validation,
  type,
}: FormInputProps<T>) => {
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
