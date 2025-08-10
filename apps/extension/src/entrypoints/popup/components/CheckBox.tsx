import { Switch } from "@headlessui/react";
import { cn } from "@/commons/utils";
import { ToolTip } from "./ToolTip";

interface CheckBoxProps {
  checked: boolean;
  text: string;
  tip?: string;
  onChange: (checked: boolean) => void;
  className?: string;
}
function InlineCheckBox({ text, checked, onChange, className }: CheckBoxProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={cn(
        "flex flex-1 cursor-pointer items-center gap-x-1.5 rounded-sm px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700",
        className,
      )}
    >
      <span>{text}</span>
    </Switch>
  );
}
export function CheckBox(props: CheckBoxProps) {
  return props.tip ? (
    <ToolTip tip={props.tip}>
      <InlineCheckBox {...props} />
    </ToolTip>
  ) : (
    <InlineCheckBox {...props} />
  );
}
