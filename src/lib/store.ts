import type { Booking, BookingRequest, Vehicle, VehicleAvailability } from "./types";

interface Store {
  bookings: Booking[];
  nextBookingId: number;
}

function getStore(): Store {
  const g = globalThis as unknown as { __eccrStore?: Store };
  if (!g.__eccrStore) {
    g.__eccrStore = {
      bookings: [
        {
          booking_id: 500,
          vehicle_id: 1,
          start_date: "2026-09-10",
          end_date: "2026-09-14",
          customer_name: "Seed Customer",
          status: "confirmed",
        },
      ],
      nextBookingId: 501,
    };
  }
  return g.__eccrStore;
}

const FLEET: Vehicle[] = [
  { id: 1, make: "Toyota", model: "Corolla", type: "sedan", location: "Southport", daily_rate: 65, active: true },
  { id: 2, make: "Toyota", model: "Camry", type: "sedan", location: "Southport", daily_rate: 78, active: true },
  { id: 3, make: "Hyundai", model: "i30", type: "hatch", location: "Southport", daily_rate: 58, active: true },
  { id: 4, make: "Mazda", model: "CX-5", type: "suv", location: "Robina", daily_rate: 95, active: true },
  { id: 5, make: "Toyota", model: "RAV4", type: "suv", location: "Robina", daily_rate: 102, active: true },
  { id: 6, make: "Ford", model: "Ranger", type: "ute", location: "Robina", daily_rate: 110, active: true },
  { id: 7, make: "Kia", model: "Carnival", type: "van", location: "Coomera", daily_rate: 135, active: true },
  { id: 8, make: "Suzuki", model: "Swift", type: "hatch", location: "Coomera", daily_rate: 52, active: true },
  { id: 9, make: "Tesla", model: "Model 3", type: "sedan", location: "Broadbeach", daily_rate: 140, active: true },
  { id: 10, make: "Nissan", model: "X-Trail", type: "suv", location: "Broadbeach", daily_rate: 98, active: true },
];

function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function isVehicleAvailable(vehicleId: number, startDate: string, endDate: string): boolean {
  const store = getStore();
  return !store.bookings.some(
    (b) =>
      b.vehicle_id === vehicleId &&
      b.status === "confirmed" &&
      datesOverlap(b.start_date, b.end_date, startDate, endDate)
  );
}

export function getAvailableVehicles(params: {
  start_date: string;
  end_date: string;
  type?: string;
  location?: string;
}): VehicleAvailability[] {
  return FLEET.filter((v) => v.active)
    .filter((v) => (params.type ? v.type === params.type : true))
    .filter((v) => (params.location ? v.location.toLowerCase() === params.location.toLowerCase() : true))
    .map((v) => ({
      ...v,
      available: isVehicleAvailable(v.id, params.start_date, params.end_date),
    }));
}

export function getFleet(): Vehicle[] {
  return FLEET;
}

export function getVehicle(vehicleId: number): Vehicle | undefined {
  return FLEET.find((v) => v.id === vehicleId);
}

export function createBooking(
  req: BookingRequest
): { ok: true; booking: Booking } | { ok: false; error: "vehicle_not_found" | "vehicle_unavailable" } {
  const vehicle = getVehicle(req.vehicle_id);
  if (!vehicle) return { ok: false, error: "vehicle_not_found" };

  if (!isVehicleAvailable(req.vehicle_id, req.start_date, req.end_date)) {
    return { ok: false, error: "vehicle_unavailable" };
  }

  const store = getStore();
  const booking: Booking = {
    booking_id: store.nextBookingId++,
    vehicle_id: req.vehicle_id,
    start_date: req.start_date,
    end_date: req.end_date,
    customer_name: req.customer_name,
    status: "confirmed",
  };
  store.bookings.push(booking);
  return { ok: true, booking };
}

export function getBooking(bookingId: number): Booking | undefined {
  return getStore().bookings.find((b) => b.booking_id === bookingId);
}

export function cancelBooking(bookingId: number): Booking | undefined {
  const booking = getBooking(bookingId);
  if (!booking) return undefined;
  booking.status = "cancelled";
  return booking;
}