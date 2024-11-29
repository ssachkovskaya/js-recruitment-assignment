import { format } from "date-fns/format"

export function getFullDateString(date: Date) {
  return format(date, "EEEE, d MMM yyyy 'at' kk:mm")
}
