import { NextRequest, NextResponse } from "next/server";

import { getAvailableVehicles } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");

  if (!start_date || !end_date) {
    return NextResponse.json({ error: "start_date and end_date are required" }, { status: 400 });
  }

  const vehicles = getAvailableVehicles({
    start_date,
    end_date,
    type: searchParams.get("type") ?? undefined,
    location: searchParams.get("location") ?? undefined,
  });

  return NextResponse.json(vehicles);
}
