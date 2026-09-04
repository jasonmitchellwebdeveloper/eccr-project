import { NextRequest, NextResponse } from "next/server";

import { createBooking } from "@/lib/store";
import type { BookingRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BookingRequest;

  if (!body.vehicle_id || !body.start_date || !body.end_date || !body.customer_name) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const result = createBooking(body);

  if (!result.ok) {
    if (result.error === "vehicle_unavailable") {
      return NextResponse.json(
        { error: "vehicle_unavailable", message: "This vehicle was booked by another customer" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.booking, { status: 201 });
}
