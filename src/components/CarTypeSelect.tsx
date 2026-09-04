"use client";

import { Car } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VehicleType } from "@/lib/types";

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatch", label: "Hatch" },
  { value: "ute", label: "Ute" },
  { value: "van", label: "Van" },
];

interface CarTypeSelectProps {
  value: VehicleType | null;
  onChange: (type: VehicleType | null) => void;
}

const CarTypeSelect = ({ value, onChange }: CarTypeSelectProps) => {
  return (
    <Select items={VEHICLE_TYPES} value={value} onValueChange={onChange}>
      <SelectTrigger className="h-auto w-auto items-center justify-start gap-3 px-3 py-2.5 text-left data-[size=default]:h-auto hover-state cursor-pointer">
        <Car className="size-5 shrink-0 text-muted-foreground" />
        <span className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Car type</span>
          <SelectValue placeholder="Any type" className="text-sm font-medium" />
        </span>
      </SelectTrigger>
      <SelectContent>
        {VEHICLE_TYPES.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CarTypeSelect;
