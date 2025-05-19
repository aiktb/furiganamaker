import { Transition, TransitionChild } from "@headlessui/react";

interface PopupTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

export default function PopupTransition({ show, children }: PopupTransitionProps) {
  return (
    <Transition appear show={show}>
      <div className="relative z-30">
        {/* Background overlay */}
        <div className="fixed inset-0 backdrop-blur backdrop-filter" />
        <TransitionChild
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="duration-300 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </TransitionChild>
          </div>
        </div>
      </div>
    </Transition>
  );
}
