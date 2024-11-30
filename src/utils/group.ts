import type { TimeSlot } from "@/types/Appointment"
import { getDatesRange, getShortDateString } from "./date"

export function groupTimeSlotsByDate({ startDate, endDate, slots} : {
  startDate: Date
  endDate: Date
  slots: TimeSlot[]
}): Record<string, TimeSlot[]> {
  const datesRange = getDatesRange(startDate, endDate)
  const datesRec = datesRange.reduce((result, date) => {
    result[getShortDateString(date)] = []
    return result
  }, {} as Record<string, TimeSlot[]>)

  for (const timeSlot of slots) {
    const date = getShortDateString(timeSlot.startDate)
    datesRec[date]?.push(timeSlot)
  }

  return datesRec
}