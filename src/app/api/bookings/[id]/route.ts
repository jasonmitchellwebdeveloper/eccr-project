import { NextRequest, NextResponse } from "next/server";

import { cancelBooking } from "@/lib/store";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = cancelBooking(Number(id));

  if (!booking) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  return NextResponse.json({ booking_id: booking.booking_id, status: booking.status });
}
