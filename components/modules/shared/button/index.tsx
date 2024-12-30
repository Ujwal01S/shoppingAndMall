import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  "w-fit mt-2 rounded bg-brand-text-footer text-white px-5 py-2 flex gap-2 items-center",
  {
    variants: {
      text: {
        secendary: "text-black",
      },
    },
  }
);

export type buttonVariantProps = VariantProps<typeof buttonStyles>;

type ButtonProps = {
  className?: string;
  content?: string;
  onClick: () => void;
  icon?: React.ReactNode;
} & buttonVariantProps;

const EventLinkButton = ({
  className,
  text,
  content,
  onClick,
  icon,
}: ButtonProps) => {
  return (
    <div
      className={twMerge(buttonStyles({ text, className }), className)}
      onClick={onClick}
    >
      {icon}
      {content}
    </div>
  );
};

export default EventLinkButton;
