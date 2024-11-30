import type { Patient } from "./Patient"

export type TimeSlot = {
  startDate: Date
  endDate: Date
  taken: boolean
}

export type Appointment = Pick<TimeSlot, "startDate" | "endDate"> & {
  doctor: string // This should be a Doctor type, keeping it simple for the prototype
  patient: Patient
  comments?: string
}
