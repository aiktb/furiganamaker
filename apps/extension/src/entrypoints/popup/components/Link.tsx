import ToolTip from "./ToolTip";

interface LinkProps {
  href: string;
  text: string;
  tip?: string;
}

export default function Link({ href, text, tip }: LinkProps) {
  function InlineLink() {
    return (
      <a
        target="_blank"
        href={href}
        rel="noopener noreferrer"
        className="flex flex-1 items-center gap-x-1 rounded-sm px-2 capitalize transition duration-300 hover:bg-gray-200 hover:text-sky-500 focus-visible:bg-gray-200 focus-visible:text-sky-500 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700"
      >
        {text}
        <i className="i-tabler-link" />
      </a>
    );
  }
  return tip ? (
    <ToolTip tip={tip}>
      <InlineLink />
    </ToolTip>
  ) : (
    <InlineLink />
  );
}
