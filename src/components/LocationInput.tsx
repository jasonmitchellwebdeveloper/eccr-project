"use client";

import { MapPin } from "lucide-react";

interface LocationInputProps {
  value: string;
  onChange: (location: string) => void;
}

const LocationInput = ({ value, onChange }: LocationInputProps) => {
  return (
    <div className="flex h-auto w-auto items-center gap-3 rounded-lg border border-input bg-transparent px-3 py-2.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30 hover:bg-muted hover-state">
      <MapPin className="size-5 shrink-0 text-muted-foreground" />
      <label className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Location</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Any location"
          className="w-32 bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
        />
      </label>
    </div>
  );
};

export default LocationInput;
