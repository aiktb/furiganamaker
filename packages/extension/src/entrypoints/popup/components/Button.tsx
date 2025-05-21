import ToolTip from "./ToolTip";

interface ButtonProps {
  text: string;
  tip?: string;
  onClick: () => void;
}

export default function Button({ text, tip, onClick }: ButtonProps) {
  function InlineButton() {
    return (
      <button
        className="flex grow cursor-pointer items-center justify-start gap-x-1 rounded-sm px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700"
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
