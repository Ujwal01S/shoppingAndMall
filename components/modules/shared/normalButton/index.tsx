import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyle = cva(
  "w-fit mt-2 rounded bg-brand-text-footer text-white px-5 py-2 flex gap-2 items-center",
  {
    variants: {
      text: {
        secondary: "text-red-500",
      },
    },
  }
);

export type buttonVariantProps = VariantProps<typeof buttonStyle>;

type ButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  content: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
} & buttonVariantProps;

export const EventButton = ({
  content,
  className,
  icon,
  text,
  onClick,
  type,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(buttonStyle({ text, className }), className)}
      type={type}
    >
      {icon}
      {content}
    </button>
  );
};
