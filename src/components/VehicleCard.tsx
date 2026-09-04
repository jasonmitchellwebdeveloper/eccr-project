import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { VehicleAvailability } from "@/lib/types";

interface VehicleCardProps {
  vehicle: VehicleAvailability;
  startDate?: string;
  endDate?: string;
}

export default function VehicleCard({ vehicle, startDate, endDate }: VehicleCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-input p-4">
      <div>
        <p className="font-medium">
          {vehicle.make} {vehicle.model}
        </p>
        <p className="text-sm text-muted-foreground capitalize">
          {vehicle.type} · {vehicle.location}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">${vehicle.daily_rate}/day</p>
          <p className={`text-sm ${vehicle.available ? "text-green-600" : "text-muted-foreground"}`}>
            {vehicle.available ? "Available" : "Unavailable"}
          </p>
        </div>
        {vehicle.available && (
          <Button
            nativeButton={false}
            render={<Link href={`/book/${vehicle.id}?start_date=${startDate}&end_date=${endDate}`} />}
          >
            Book
          </Button>
        )}
      </div>
    </div>
  );
}
