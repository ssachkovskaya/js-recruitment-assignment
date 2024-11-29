import type { Patient } from "./Patient"

export type Appointment = {
  startDate: Date
  endDate: Date
  doctor: string // This should be a Doctor type, keeping it simple for the prototype
  patient: Patient
  comments?: string
}
