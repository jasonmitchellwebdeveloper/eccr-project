"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface BookingFormProps {
  vehicleId: number;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export default function BookingForm({ vehicleId, defaultStartDate, defaultEndDate }: BookingFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(defaultStartDate ?? "");
  const [endDate, setEndDate] = useState(defaultEndDate ?? "");
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle_id: vehicleId,
        start_date: startDate,
        end_date: endDate,
        customer_name: customerName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      setError(data.message ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/bookings/${data.booking_id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-input p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="start_date" className="text-sm font-medium">
          Start date
        </label>
        <input
          id="start_date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="end_date" className="text-sm font-medium">
          End date
        </label>
        <input
          id="end_date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="customer_name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="customer_name"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Booking..." : "Confirm booking"}
      </Button>
    </form>
  );
}
