import { cn } from "@/commons/utils";
import { ToolTip } from "./ToolTip";

interface ButtonProps {
  text: string;
  tip?: string;
  onClick: () => void;
  className?: string;
}

export function Button({ text, tip, onClick, className }: ButtonProps) {
  function InlineButton() {
    return (
      <button
        className={cn(
          "flex grow cursor-pointer items-center justify-start gap-x-1 rounded-sm px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700",
          className,
        )}
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
  return tip ? (
    <ToolTip tip={tip}>
      <InlineButton />
    </ToolTip>
  ) : (
    <InlineButton />
  );
}
