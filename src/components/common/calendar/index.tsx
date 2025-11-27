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
  const [dateTime, setDateTime] = React.useState<Date | undefined>(() => {
    // Initialize with epoch if provided, otherwise use current date/time
    if (epoch !== undefined) {
      return new Date(epoch * 1000)
    }
    return new Date()
  })

  // Convert epoch to Date when epoch prop changes
  React.useEffect(() => {
    if (epoch !== undefined) {
      const dateFromEpoch = new Date(epoch * 1000) // Convert seconds to milliseconds
      setDateTime(dateFromEpoch)
    }
  }, [epoch])

  // Format time for the input value (HH:MM:SS format)
  const formatTimeForInput = (date: Date | undefined) => {
    if (!date) return ""
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // If we already have a dateTime, preserve the time
      if (dateTime) {
        const newDateTime = new Date(date)
        newDateTime.setHours(dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds())
        setDateTime(newDateTime)
        
        // Call onEpochChange if provided
        if (onEpochChange) {
          onEpochChange(Math.floor(newDateTime.getTime() / 1000))
        }
      } else {
        // No existing time, just set the date
        setDateTime(date)
        
        // Call onEpochChange if provided
        if (onEpochChange) {
          onEpochChange(Math.floor(date.getTime() / 1000))
        }
      }
    }
    setOpen(false)
  }

  // Handle time selection
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value
    if (timeString) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number)
      const newDateTime = dateTime ? new Date(dateTime) : new Date()
      newDateTime.setHours(hours || 0, minutes || 0, seconds || 0)
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
              className="justify-between w-48 font-normal rounded-2xl border border-white/15 bg-[#05060f]/60 px-4 py-3 text-sm text-white/80 hover:bg-[#090b18]/70 hover:text-white"
            >
              {formatDateTime(dateTime)}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 overflow-hidden rounded-xl border border-white/20 bg-[#0a0d14] shadow-[0_10px_40px_rgba(0,0,0,0.5)]" align="start">
            <Calendar
              mode="single"
              selected={dateTime}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              className="border-none outline-none bg-[#0a0d14] text-white/80"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="appointment-time"
          step="1"
          value={formatTimeForInput(dateTime)}
          onChange={handleTimeChange}
          className="rounded-2xl border border-white/15 bg-[#05060f]/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/50 focus:bg-[#090b18]/70 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}