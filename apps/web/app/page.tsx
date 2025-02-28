import { Button } from "@workspace/ui/components/button";
import { ScheduleDialog } from "@workspace/ui/components/schedule-dialog";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Back Office: Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Scheduling platform that adapts to any business.
          </p>
        </div>
        <div className="flex gap-4">
          <ScheduleDialog
            trigger={<Button>New Appointment</Button>}
            title="Back Office Calendar Demo"
            description="Eliminate scheduling headaches with Back Office Calendar."
          />
          <Button variant="ghost" asChild>
            <Link href="/bookings">Calendar Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
