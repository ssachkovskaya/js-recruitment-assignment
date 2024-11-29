<script lang="ts" setup>
import { ref } from "vue"
import { Appointment } from "@/types/Appointment"
import { getFullDateString } from "@/utils/date"
import BaseCard from "@/components/BaseCard.vue"
import BaseButton from "@/components/BaseButton.vue"

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

    <BaseCard class="calendarPlaceholder">
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
    min-width: 400px;
    max-width: 600px;
    margin: 30px auto;
  }

  .calendarPlaceholder {
    min-height: 400px;
  }
</style>