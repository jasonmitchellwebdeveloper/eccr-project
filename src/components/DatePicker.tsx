"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const title = "Calendar with Range in Dialog";

const today = new Date();
today.setHours(0, 0, 0, 0); // normalize so "today" itself stays selectable

interface DatePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [date, setDate] = useState<DateRange | undefined>(value);
  const [numberOfMonths, setNumberOfMonths] = useState<1 | 2>(1);

  const dialogPrompt = !date?.from ? "Select your pickup date" : "Select dropoff date";

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setDate(value);
        } else if (date?.from && date?.to) {
          onChange(date);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-auto items-center justify-start gap-3 px-3 py-2.5 text-left cursor-pointer"
          />
        }
      >
        <CalendarIcon className="size-5 shrink-0 text-muted-foreground" />
        <span className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Select dates</span>
          <span className="text-sm font-medium">
            {value?.from ? format(value.from, "d MMM yyyy") : "Pick-up date"}
            {" — "}
            {value?.to ? format(value.to, "d MMM yyyy") : "Drop-off date"}
          </span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{dialogPrompt}</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            className="self-end"
            onClick={() => setNumberOfMonths((n) => (n === 1 ? 2 : 1))}
          >
            Show {numberOfMonths === 1 ? "2 months" : "1 month"}
          </Button>
        </DialogHeader>
        <Calendar
          className="rounded-md border"
          mode="range"
          numberOfMonths={numberOfMonths}
          onSelect={setDate}
          selected={date}
          disabled={{ before: today }}
        />
        <DialogFooter>
          <DialogClose render={<Button variant={date?.from || date?.to ? 'default' : 'ghost'}
          disabled={!date?.from || !date?.to} />}>
            Select Dates
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatePicker;
