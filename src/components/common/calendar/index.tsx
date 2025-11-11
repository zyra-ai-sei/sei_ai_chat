import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
  epoch?: number; // Optional epoch timestamp in seconds
  onEpochChange?: (epoch: number) => void; // Optional callback when epoch changes
}

export function Calendar24({ epoch, onEpochChange }: Calendar24Props) {
  const [open, setOpen] = React.useState(false)
  const [dateTime, setDateTime] = React.useState<Date | undefined>(undefined)

  // Convert epoch to Date when epoch prop changes
  React.useEffect(() => {
    if (epoch !== undefined) {
      const dateFromEpoch = new Date(epoch * 1000) // Convert seconds to milliseconds
      setDateTime(dateFromEpoch)
    }
  }, [epoch])

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // If we already have a dateTime, preserve the time
      if (dateTime) {
        const newDateTime = new Date(date)
        newDateTime.setHours(dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds())
        setDateTime(newDateTime)
      } else {
        // No existing time, just set the date
        setDateTime(date)
      }
    }
    setOpen(false)
    
    // Call onEpochChange if provided
    if (onEpochChange && date) {
      onEpochChange(Math.floor(date.getTime() / 1000))
    }
  }

  // Handle time selection
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value
    if (timeString && dateTime) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number)
      const newDateTime = new Date(dateTime)
      newDateTime.setHours(hours, minutes, seconds || 0)
      setDateTime(newDateTime)
      
      // Call onEpochChange if provided
      if (onEpochChange) {
        onEpochChange(Math.floor(newDateTime.getTime() / 1000))
      }
    }
  }

  // Format dateTime for display
  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "Select date and time"
    
    const dateStr = date.toLocaleDateString()
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${dateStr} ${timeStr}`
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="justify-between w-48 font-normal text-white border-none bg-zinc-800"
            >
              {formatDateTime(dateTime)}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
            <Calendar
              mode="single"
              selected={dateTime}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              className="border-none outline-none bg-zinc-800 border-zinc-500 text-zinc-300"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="appointment-time"
          step="1"
          onChange={handleTimeChange}
          defaultValue={dateTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          className="bg-zinc-800 border-none text-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}