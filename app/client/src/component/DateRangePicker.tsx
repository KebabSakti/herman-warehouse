import { Datepicker } from "flowbite-react";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";

type DateRangeValue = { start: Date | null; end: Date | null };
type DateRangeCallback = (value: DateRangeValue) => void;

export function DateRangePicker({ onChange }: { onChange: DateRangeCallback }) {
  const [value, setValue] = useState<DateRangeValue>({
    start: new Date(),
    end: new Date(),
  });

  return (
    <>
      <div className="flex items-center gap-1">
        <Datepicker
          name="start"
          value={value.start}
          onChange={(date) => {
            onChange({ ...value, start: date });
            setValue({ ...value, start: date });
          }}
        />
        <HiArrowRight className="text-oncontainer" />
        <Datepicker
          name="end"
          value={value.end}
          onChange={(date) => {
            onChange({ ...value, end: date });
            setValue({ ...value, end: date });
          }}
        />
      </div>
    </>
  );
}
