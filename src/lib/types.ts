export type VehicleType = "sedan" | "suv" | "hatch" | "ute" | "van";

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  type: VehicleType;
  location: string;
  daily_rate: number;
  active: boolean;
}

export const VEHICLE_TYPES = [
    { value: "sedan",label:"Sedan"},
    { value: "suv",label:"SUV"},
    { value: "hatch",label:"Hatch"},
    { value: "ute",label:"Ute"},
    { value: "van",label:"Van"},
]

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  booking_id: number;
  vehicle_id: number;
  start_date: string; // ISO yyyy-mm-dd
  end_date: string; // ISO yyyy-mm-dd
  customer_name: string;
  status: BookingStatus;
}

export interface VehicleAvailability extends Vehicle {
  available: boolean;
}

export interface BookingConflictError {
  error: "vehicle_unavailable";
  message: string;
}

export interface BookingRequest {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  customer_name: string;
}
