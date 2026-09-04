"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CancelBookingButtonProps {
  bookingId: number;
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleCancel} disabled={cancelling}>
      {cancelling ? "Cancelling..." : "Cancel booking"}
    </Button>
  );
}
