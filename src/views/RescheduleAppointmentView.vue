<script lang="ts" setup>
import { ref } from "vue"
import type { Appointment, TimeSlot } from "@/types/Appointment"
import { getFullDateString } from "@/utils/date"
import BaseCard from "@/components/BaseCard.vue"
import BaseButton from "@/components/BaseButton.vue"
import AppointmentCalendar from "@/components/AppointmentCalendar.vue"
import fakeTimeSlots from '@/__tests__/mocks/fakeTimeSlots.json'

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

const newTimeSlot = ref<Pick<Appointment, "startDate" | "endDate">>({
  startDate: new Date("2024-12-09T09:20:00"),
  endDate: new Date("2024-12-09T09:40:00"),
})

const calendarSettings = ref({
  startDate: new Date("2024-12-09"),
  endDate: new Date("2024-12-15"),
  showLoader: false,
  slots: fakeTimeSlots.map((slot) => ({
    startDate: new Date(slot.Start),
    endDate: new Date(slot.End),
    taken: slot.Taken || false
  })) satisfies TimeSlot[]
})

</script>

<template>
  <div class="container">
    <p class="my-6">
      Confirm your appointment with <span class="font-weight-bold">{{ currentAppointment.doctor }}</span>
    </p>

    <BaseCard class="d-flex align-center ga-3">
      <v-icon icon="$calendar" color="grey" />
      <span>On {{ getFullDateString(currentAppointment.startDate) }}</span>
    </BaseCard>

    <p class="font-weight-bold mt-6">Did you have an unexpected situation?</p>
    <p class="mb-6">You can change the appointment for when it suits you better</p>

    <BaseCard class="py-4">
      <AppointmentCalendar
        :startDate="calendarSettings.startDate"
        :endDate="calendarSettings.endDate"
        :slots="calendarSettings.slots"
        :showLoader="calendarSettings.showLoader"
      />
    </BaseCard>

    <div v-if="newTimeSlot">
      <p class="font-weight-bold mt-6">Reschedule</p>
      <p class="mb-6">Click the button to confirm</p>

      <BaseButton class="w-100">
        {{ getFullDateString(newTimeSlot.startDate) }}
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