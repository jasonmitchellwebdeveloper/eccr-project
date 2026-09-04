import { notFound } from "next/navigation";

import BookingForm from "@/components/BookingForm";
import { getVehicle } from "@/lib/store";

interface BookPageProps {
  params: Promise<{ vehicleId: string }>;
  searchParams: Promise<{ start_date?: string; end_date?: string }>;
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const { vehicleId } = await params;
  const { start_date, end_date } = await searchParams;
  const vehicle = getVehicle(Number(vehicleId));

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-xl font-semibold">
          Book the {vehicle.make} {vehicle.model}
        </h1>
        <p className="text-sm text-muted-foreground">
          {vehicle.location} · ${vehicle.daily_rate}/day
        </p>
      </div>
      <BookingForm vehicleId={vehicle.id} defaultStartDate={start_date} defaultEndDate={end_date} />
    </main>
  );
}
