import { fetchWeeklySlots } from "@/services/appointmentService"
import type { TimeSlot } from "@/types/Appointment"
import { isMonday, isSameWeek, nextMonday, previousMonday } from "date-fns"
import { ref, watchEffect, toValue, type Ref } from "vue"

// API allows to fetch slots only if the passed date is Monday
// so we need to get all Mondays between startDate and endDate
function getUrlDates(startDate: Date, endDate: Date) {
  let monday = isMonday(startDate) ? startDate : previousMonday(startDate)

  const urlDates = [monday]
  while (!isSameWeek(monday, endDate)) {
    monday = nextMonday(monday)
    urlDates.push(monday)
  } 

  return urlDates
}

export function useFetchTimeSlots(startDate: Date | Ref<Date>, endDate: Date | Ref<Date>) {
  const isLoading= ref(false)
  const data = ref<TimeSlot[]>()
  const error = ref<string>()

  watchEffect(async () => {
    isLoading.value = true
    data.value = undefined
    error.value = undefined

    const dates = getUrlDates(toValue(startDate), toValue(endDate))

    await Promise.all(dates.map((date) => fetchWeeklySlots(date)))
      .then((slots) => (data.value = slots.flat()))
      .catch((err) => (error.value = err))
      .finally(() => (isLoading.value = false))
  })

  return { data, error, isLoading }
}
