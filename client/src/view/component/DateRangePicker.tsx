import { Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";

type DateRangeValue = { start: Date | null; end: Date | null };
type DateRangeCallback = (value: DateRangeValue) => void;

export function DateRangePicker({ onChange }: { onChange: DateRangeCallback }) {
  const [value, setValue] = useState<DateRangeValue>({
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <>
      <div className="flex items-center gap-1">
        <Datepicker
          name="start"
          onChange={(date) => {
            setValue({ ...value, start: date });
          }}
        />
        <HiArrowRight className="text-oncontainer" />
        <Datepicker
          name="end"
          onChange={(date) => {
            setValue({ ...value, end: date });
          }}
        />
      </div>
    </>
  );
}
