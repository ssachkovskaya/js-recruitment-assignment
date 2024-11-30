import { eachDayOfInterval } from "date-fns/eachDayOfInterval"
import { format } from "date-fns/format"

export function getFullDateString(date: Date) {
  return format(date, "EEEE, d MMM yyyy 'at' kk:mm")
}

export function getShortDateString(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function getDayOfWeekString(date: Date | string) {
  return format(date, 'EEE')
}

export function getDayMonthString(date: Date | string) {
  return format(date, 'd MMM')
}

export function getTime24String(date: Date) {
  return format(date, 'kk:mm')
}

export function getDatesRange(startDate: Date, endDate: Date) {
  return eachDayOfInterval({ start: startDate, end: endDate })
}
