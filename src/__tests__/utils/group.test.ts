import { describe, it, expect } from "vitest"
import { groupTimeSlotsByDate } from "@/utils/group"
import { getShortDateString } from "@/utils/date"
import type { TimeSlot } from "@/types/Appointment"

function createTimeSlot(start: string, end: string): TimeSlot {
  return {
    startDate: new Date(start),
    endDate: new Date(end),
    taken: false
  }
}

describe("groupTimeSlotsByDate", () => {
  const slotsRec: Record<string, TimeSlot[]> = {
    "2023-01-01": [
      createTimeSlot("2023-01-01T10:00:00", "2023-01-01T11:00:00"),
      createTimeSlot("2023-01-01T14:00:00", "2023-01-01T15:00:00"),
    ],
    "2023-01-02": [
      createTimeSlot("2023-01-02T12:00:00", "2023-01-02T13:00:00"),
    ]
  }

  it("should group time slots by date", () => {
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2023-01-03")
    const slots = Object.values(slotsRec).flat()

    const result = groupTimeSlotsByDate({ startDate, endDate, slots })

    expect(result[getShortDateString(new Date("2023-01-01"))]).toEqual(slotsRec["2023-01-01"])
    expect(result[getShortDateString(new Date("2023-01-02"))]).toEqual(slotsRec["2023-01-02"])
    expect(result[getShortDateString(new Date("2023-01-03"))]).toEqual([])
  })

  it("should return empty object if no slots are provided", () => {
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2023-01-03")
    const slots: TimeSlot[] = []

    const result = groupTimeSlotsByDate({ startDate, endDate, slots })

    expect(result[getShortDateString(new Date("2023-01-01"))]).toEqual([])
    expect(result[getShortDateString(new Date("2023-01-02"))]).toEqual([])
    expect(result[getShortDateString(new Date("2023-01-03"))]).toEqual([])
  })

  it("should handle slots outside the date range", () => {
    const startDate = new Date("2023-01-06")
    const endDate = new Date("2023-01-08")
    const slots: TimeSlot[] = Object.values(slotsRec).flat()

    const result = groupTimeSlotsByDate({ startDate, endDate, slots })

    expect(result[getShortDateString(new Date("2023-01-06"))]).toEqual([])
    expect(result[getShortDateString(new Date("2023-01-07"))]).toEqual([])
    expect(result[getShortDateString(new Date("2023-01-08"))]).toEqual([])
  })
})