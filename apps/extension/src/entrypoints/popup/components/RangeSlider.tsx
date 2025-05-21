import { useRef } from "react";

interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  onChange: (value: number) => void;
}

export default function RangeSlider({ value, min, max, step, label, onChange }: RangeSliderProps) {
  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  const trackRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  function handlePointerDown(event: React.PointerEvent) {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!(track && thumb)) {
      return;
    }

    const updateValue = (clientX: number) => {
      const { width, left } = track.getBoundingClientRect();
      const percent = clamp((clientX - left) / width, 0, 1);
      const value = Math.round(percent * (max - min) + min);
      onChange(value);
    };
    const handlePointerMove = (event: PointerEvent) => {
      updateValue(event.clientX);
    };
    const handlePointerUp = (event: PointerEvent) => {
      track.releasePointerCapture(event.pointerId);
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", handlePointerUp);
    };

    track.setPointerCapture(event.pointerId);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", handlePointerUp);
    updateValue(event.clientX);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      onChange(clamp(value - step, min, max));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      onChange(clamp(value + step, min, max));
    }
  }
  return (
    <div
      tabIndex={0}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value}%`}
      aria-label={label}
      className="relative flex h-5 grow cursor-pointer items-center justify-start gap-x-1 rounded-sm px-2 leading-5 transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700"
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    >
      <div
        className="flex h-[3px] w-full justify-center rounded-full bg-current"
        aria-hidden="true"
      >
        <div ref={trackRef} className="relative h-[3px] w-[90%] rounded-lg bg-current">
          <div
            ref={thumbRef}
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-[15px] rounded-full bg-sky-500"
            style={{ left: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
