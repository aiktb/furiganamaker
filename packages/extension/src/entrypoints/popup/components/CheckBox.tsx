import { Switch } from "@headlessui/react";

import ToolTip from "./ToolTip";

interface CheckBoxProps {
  checked: boolean;
  text: string;
  tip?: string;
  onChange: (checked: boolean) => void;
}
function InlineCheckBox({ text, checked, onChange }: CheckBoxProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className="flex items-center gap-x-1.5 rounded px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700"
    >
      <span>{text}</span>
    </Switch>
  );
}
export default function CheckBox(props: CheckBoxProps) {
  return props.tip ? (
    <ToolTip tip={props.tip}>
      <InlineCheckBox {...props} />
    </ToolTip>
  ) : (
    <InlineCheckBox {...props} />
  );
}
