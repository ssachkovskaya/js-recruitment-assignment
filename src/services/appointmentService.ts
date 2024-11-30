import type { Appointment, TimeSlot } from "@/types/Appointment"
import { format } from "date-fns/format"

type TimeSlotResponse = Array<{
  Start: string
  End: string
  Taken: boolean
}>

type AppointmentArg = {
  Start: string
  End: string
  Comments?: string
  Patient: {
    Name: string
    SecondName: string
    Email: string
    Phone: string
  }
}

// TODO: it should be in env file
const API_URL = "https://draliatest.azurewebsites.net/api"

export async function fetchWeeklySlots(monday: Date): Promise<TimeSlot[]> {
  const url = `${API_URL}/availability/GetWeeklySlots/${format(monday, "yyyyMMdd")}`
  const res = await fetch(url)
  const slots = await res.json() as TimeSlotResponse

  return slots.map((slot) => ({
    startDate: new Date(slot.Start),
    endDate: new Date(slot.End),
    taken: slot.Taken || false
  })) satisfies TimeSlot[]
}

export async function saveAppointment(appointment: Appointment): Promise<boolean> {
  const url = `${API_URL}/availability/BookSlot`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Start: format(appointment.startDate, "yyyy-MM-dd HH:mm:ss"),
      End: format(appointment.endDate, "yyyy-MM-dd HH:mm:ss"),
      Comments: appointment.comments,
      Patient: {
        Name: appointment.patient.name,
        SecondName: appointment.patient.secondName,
        Email: appointment.patient.email,
        Phone: appointment.patient.phone
      }
    } satisfies AppointmentArg)}
  )

  return res.ok
}