import { notFound } from "next/navigation";

import CancelBookingButton from "@/components/CancelBookingButton";
import { getBooking, getVehicle } from "@/lib/store";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const booking = getBooking(Number(id));
  const vehicle = booking && getVehicle(booking.vehicle_id);

  if (!booking || !vehicle) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-semibold">Booking confirmed</h1>
      <div className="flex flex-col gap-3 rounded-lg border border-input p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Booking #{booking.booking_id}</p>
            <p className="font-medium">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
              booking.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {booking.status}
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Start date</dt>
            <dd>{booking.start_date}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">End date</dt>
            <dd>{booking.end_date}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Customer</dt>
            <dd>{booking.customer_name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd>{vehicle.location}</dd>
          </div>
        </dl>
        {booking.status === "confirmed" && <CancelBookingButton bookingId={booking.booking_id} />}
      </div>
    </main>
  );
}
