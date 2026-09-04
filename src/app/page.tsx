"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { VehicleAvailability, VehicleType } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { Search } from "lucide-react";
import { format } from "date-fns";

import CarTypeSelect from "@/components/CarTypeSelect";
import DatePicker from "@/components/DatePicker";
import LocationInput from "@/components/LocationInput";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";

import Logo from "@/assets/images/logo.svg";

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [location, setLocation] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const hasSearchDates = Boolean(searchParams.get("start_date") && searchParams.get("end_date"));

  const [vehicles, setVehicles] = useState<VehicleAvailability[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSearchDates) return;
    // yeah this trips the new set-state-in-effect rule but it's the normal
    // fetch-in-effect pattern, not worth pulling in a data lib just for this
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/vehicles/availability?${searchParams.toString()}`)
      .then((res) => res.json())
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, [searchParams, hasSearchDates]);

  function handleSearch() {
    const params = new URLSearchParams();

    if (dateRange?.from) {
      params.set("start_date", format(dateRange.from, "yyyy-MM-dd"));
    }
    if (dateRange?.to) {
      params.set("end_date", format(dateRange.to, "yyyy-MM-dd"));
    }
    if (vehicleType) {
      params.set("type", vehicleType);
    }
    if (location) {
      params.set("location", location);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-10 items-center w-full py-10">
      <h1 className="visually-hidden">East Coast Car Rentals</h1>
      <Image
        src={Logo}
        alt="East Coast Car Rentals"
        className="h-auto w-[400]"
        loading="eager"
      />
      <section className="shadow-md border-solid border-1 rounded-md flex flex-col sm:flex-row w-full sm:w-fit gap-3 p-3">
        <DatePicker value={dateRange} onChange={setDateRange} />
        <CarTypeSelect value={vehicleType} onChange={setVehicleType} />
        <LocationInput value={location} onChange={setLocation} />
        <Button
          className="h-auto gap-1.5 px-6"
          onClick={handleSearch}
          disabled={!dateRange?.from || !dateRange?.to}
        >
          <Search className="size-4" />
          Search
        </Button>
      </section>

      <section className="flex w-full max-w-2xl flex-col gap-3">
        {loading && <p className="text-center text-sm text-muted-foreground">Searching...</p>}
        {!loading && vehicles?.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No vehicles match your search.
          </p>
        )}
        {!loading &&
          vehicles?.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              startDate={searchParams.get("start_date") ?? undefined}
              endDate={searchParams.get("end_date") ?? undefined}
            />
          ))}
      </section>
    </div>
  );
}
