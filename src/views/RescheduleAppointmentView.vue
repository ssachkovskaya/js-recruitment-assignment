<script lang="ts" setup>
import { ref, computed } from "vue"
import type { Appointment, TimeSlot } from "@/types/Appointment"
import { getFullDateString, getDateAfter } from "@/utils/date"
import BaseCard from "@/components/BaseCard.vue"
import BaseButton from "@/components/BaseButton.vue"
import AppointmentCalendar from "@/components/AppointmentCalendar.vue"
import { useFetchTimeSlots } from "@/composables/useFetchTimeSlots"
import { saveAppointment } from "@/services/appointmentService"

const VISIBLE_DAYS_COUNT = 7

// This is a mocked appointment for demo purposes
const currentAppointment = ref<Appointment>({
  startDate: new Date("2024-12-09T09:20:00"),
  endDate: new Date("2024-12-09T09:40:00"),
  doctor: "Dr. Simeon Molas",
  patient: {
    name: "John",
    secondName: "Doe",
    email: "jon.doe@gmail.com",
    phone: "123456789",
  },
})

const calendarStartDate = ref(new Date())
const calendarEndDate = computed(
  () => getDateAfter(calendarStartDate.value, VISIBLE_DAYS_COUNT - 1)
)

const {
  isLoading: isTimeSlotsLoading,
  data: slots,
  error: slotsError
} = useFetchTimeSlots(calendarStartDate, calendarEndDate)

const newAppointmentSlot = ref<Pick<Appointment, "startDate" | "endDate">>()
const isSavingAppointment = ref(false)

async function save() {
  isSavingAppointment.value = true

  try {
    const newAppointment = {
      ...currentAppointment.value,
      ...newAppointmentSlot.value,
    }

    await saveAppointment(newAppointment)

    currentAppointment.value.startDate = newAppointment.startDate
    currentAppointment.value.endDate = newAppointment.endDate

    // Disable this slot in the calendar
    const savedSlot = slots.value?.find(
      (slot) => slot.startDate === newAppointment.startDate
    )
    if (savedSlot) {
      savedSlot.taken = true
    }

    newAppointmentSlot.value = undefined
  } catch (error) {
    // TODO: Show the error to users
  } finally {
    isSavingAppointment.value = false
  }
}

function goNext() {
  calendarStartDate.value = getDateAfter(calendarEndDate.value, 1)
}

function goPrev() {
  calendarStartDate.value = getDateAfter(calendarStartDate.value, -VISIBLE_DAYS_COUNT)
}

function selectNewSlot(slot: TimeSlot) {
  if (!isSavingAppointment.value) {
    newAppointmentSlot.value = slot
  }
}

</script>

<template>
  <div class="container">
    <p class="my-6">
      Confirm your appointment with <span class="font-weight-bold">{{ currentAppointment.doctor }}</span>
    </p>

    <BaseCard class="d-flex align-center ga-3">
      <v-progress-circular v-if="isSavingAppointment" size="16" width="2" color="grey" indeterminate />
      <v-icon v-else icon="$calendar" color="grey" />
      <span :class="{ 'text-decoration-line-through': isSavingAppointment }">
        On {{ getFullDateString(currentAppointment.startDate) }}
      </span>
    </BaseCard>

    <p class="font-weight-bold mt-6">Did you have an unexpected situation?</p>
    <p class="mb-6">You can change the appointment for when it suits you better</p>

    <BaseCard class="py-4">
      <p v-if="!isTimeSlotsLoading && slotsError" class="font-weight-bold">
        We could not load the available time slots. Please reload the page.
      </p>
      <AppointmentCalendar
        v-else
        :startDate="calendarStartDate"
        :endDate="calendarEndDate"
        :slots="slots"
        :selectedSlotDate="newAppointmentSlot?.startDate"
        :showLoader="isTimeSlotsLoading"
        @goNext="goNext"
        @goPrev="goPrev"
        @selectSlot="selectNewSlot"
      />
    </BaseCard>

    <div v-if="newAppointmentSlot">
      <p class="font-weight-bold mt-6">Reschedule</p>
      <p class="mb-6">Click the button to confirm</p>

      <BaseButton :disabled="isSavingAppointment" class="w-100" @click="save">
        {{ getFullDateString(newAppointmentSlot.startDate) }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
  .container {
    min-width: 450px;
    max-width: 800px;
    margin: 30px auto;
  }

  .calendarPlaceholder {
    min-height: 400px;
  }
</style>