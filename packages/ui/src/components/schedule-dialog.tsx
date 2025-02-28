"use client";

import React, { useEffect } from "react";
import { Button } from "./button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Clock, MapPin, Globe, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Calendar } from "@workspace/ui/components/calendar";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
type ScheduleDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
};

type Step = "select-time" | "enter-details" | "confirmation";
type TimeSlot = {
  time: string;
  available: boolean;
};

const addMinutesToTimeString = (
  timeStr: string,
  minutes: number = 30
): string => {
  const [hours, mins] = timeStr.split(":").map((num) => parseInt(num, 10));
  const date = new Date();
  date.setHours(hours || 0, mins || 0);
  date.setMinutes((date.getMinutes() || 0) + minutes);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

export function ScheduleDialog({
  trigger,
  title,
  description,
}: ScheduleDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("select-time");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState<string | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [timezone, setTimezone] = React.useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const isDisabledDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if it's a past date
    if (date < today) return true;

    // Check if it's a weekend (0 = Sunday, 6 = Saturday)
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Generate time slots (30 min intervals)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      // Add :00 slot
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        available: Math.random() > 0.3, // Randomly make some slots unavailable
      });

      // Add :30 slot
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:30`,
        available: Math.random() > 0.3,
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time: string) => {
    setIsTransitioning(true);
    setTime(time);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setStep("select-time");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep("select-time");
      setTime(undefined);
      setDate(new Date());
      setIsTransitioning(false);
    }
  };

  useEffect(() => {
    if (time) {
      setStep("enter-details");
    }
  }, [time]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`${step === "select-time" ? "sm:max-w-[900px]" : "sm:max-w-[680px]"} sm:h-[400px] p-0 overflow-hidden`}>
        <>
          <div className="grid grid-cols-1 md:grid-cols-[289px_1fr] relative">
            {/* Meeting information */}
            <div className="space-y-2 sm:border-r min-h-full p-6 bg-white z-50">
              <DialogHeader className="mb-4">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 mt-0.5" />
                <span>30 minutes</span>
              </div>
              <div className="flex items-start gap-2 text-sm mt-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Virtual Meeting</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Globe className="h-4 w-4 mt-0.5" />
                <Select defaultValue={timezone} onValueChange={setTimezone}>
                  <SelectTrigger
                    id="timezone"
                    className="w-full border-none focus:ring-0 shadow-none p-0 justify-start gap-2 h-5"
                  >
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="Asia/Bangkok">Bangkok</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {step === "enter-details" && (
                <>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <CalendarIcon className="h-4 w-4 mt-0.5" />
                    <div>
                      {date?.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <Clock className="h-4 w-4 mt-0.5" />
                    <span>
                      {time && `${time} - ${addMinutesToTimeString(time)}`}
                    </span>
                  </div>
                </>
              )}
            </div>
            {step === "select-time" && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 transition-all duration-300 ease-in-out ${isTransitioning ? "animate-in fade-in slide-in-from-left" : ""}`}>
                {/* Calendar */}
                <div className="pt-2 pb-4 p-0 border-r">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="h-full w-full flex"
                    classNames={{
                      months:
                        "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                      month: "space-y-4 w-full flex flex-col",
                      table: "w-full border-collapse space-y-1",
                      cell: "bg-transparent",
                      head_row: "",
                      row: "w-full mt-2",
                    }}
                    disabled={isDisabledDate}
                  />
                </div>
                {/* Time Slot */}
                <div className="p-6">
                  <h3 className="font-medium text-sm">Available Times</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    on {date?.toLocaleDateString()}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot, i) => (
                      <Button
                        key={i}
                        variant={time === slot.time ? "default" : "outline"}
                        className="justify-start"
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === "enter-details" && (
              <div className="transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-right">
                <div className="p-6">
                  <DialogHeader className="mb-4">
                    <DialogTitle>Enter Your Details</DialogTitle>
                    <DialogDescription className="text-sm">
                      Please provide your information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="space-y-1">
                      <Label className="text-sm">Name</Label>
                      <Input />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Email</Label>
                      <Input />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Additional notes</Label>
                      <Textarea
                        placeholder="Please share anything that will help prepare for our meeting"
                        className="resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </div>
              </div>
            )}
          </div>
        </>

        <div className="flex justify-center gap-1 text-xs p-6 sr-only">
          <h3 className="font-semibold">Back Office</h3>
          <h3 className="font-semibold text-muted-foreground">Calendar</h3>
        </div>
      </DialogContent>
    </Dialog>
  );
}
