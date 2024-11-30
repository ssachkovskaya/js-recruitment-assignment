<script lang="ts" setup>
import { ref, computed } from "vue"
import { groupTimeSlotsByDate } from "@/utils/group"
import { getDayMonthString, getDayOfWeekString, getTime24String, isFutureDate, isEqualDate } from "@/utils/date"
import type { TimeSlot } from "@/types/Appointment"
import BaseButton from "@/components/BaseButton.vue"

type AppointmentCalendarProps = {
  startDate: Date
  endDate: Date
  slots?: TimeSlot[]
  selectedSlotDate?: Date
  showLoader?: boolean
  slotsPreviewCount?: number
}

type DaySchedule = {
  dateString: string
  dayOfWeek: string
  slots: Array<{
    timeString: string
    startDate: Date
    endDate: Date
    taken: boolean
  }>
}

const {
  startDate,
  endDate,
  slots,
  slotsPreviewCount = 7,
  selectedSlotDate
} = defineProps<AppointmentCalendarProps>()

const emit = defineEmits(['goPrev', 'goNext', 'selectSlot'])

const dates = computed(() => {
  if (!slots) {
    return []
  }

  const datesRec = groupTimeSlotsByDate({ startDate, endDate, slots })

  return Object.entries(datesRec).map(([dateString, slots]) => {
    // Let's cut off the leading slots which are not available
    // as they will just pollute the UI
    const firstAvailableSlotIndex = slots.findIndex((slot) => !slot.taken)
    const visibleSlots = firstAvailableSlotIndex > 1
      ? slots.slice(firstAvailableSlotIndex - 1)
      : slots

    return {
      dateString: getDayMonthString(dateString),
      dayOfWeek: getDayOfWeekString(dateString),
      slots: visibleSlots.map((slot) => ({
        timeString: getTime24String(slot.startDate),
        startDate: slot.startDate,
        endDate: slot.endDate,
        taken: slot.taken
      }))
    } satisfies DaySchedule
  })
})

const showAllSlots = ref(false)

const isSlotsPreviewEnabled = computed(() => {
  return dates.value.some(
    (day) => day.slots.length > slotsPreviewCount
  )
})

const displayedDates = computed(() => {
  if (showAllSlots.value || !isSlotsPreviewEnabled.value) {
    return dates.value
  }

  return dates.value.map((day) => ({
    ...day,
    slots: day.slots.slice(0, slotsPreviewCount)
  }))
})

// going back to the past is not allowed
const canGoPrev = computed(() => isFutureDate(startDate))

function goPrev() {
  emit('goPrev')
}

function goNext () {
  emit('goNext')
}

function selectSlot (slot: TimeSlot) {
  if (slot.startDate !== selectedSlotDate) {
    emit('selectSlot', slot)
  }
}

</script>

<template>
  <div class="position-relative">
    <div class="d-flex ga-2">
      <BaseButton
        aria-label="Show earlier dates"
        default-class="align-self-start rounded-circle"
        variant="primary-light"
        :disabled="!canGoPrev || showLoader"
        @click="goPrev"
      >
        <v-icon icon="$prev" class="ma-1" />
      </BaseButton>

      <div
        v-for="date of displayedDates"
        :key="date.dateString"
        class="flex-1-1 d-flex flex-column align-center"
      >
        <p>{{ date.dayOfWeek }}</p>
        <p class="text-caption text-light">{{ date.dateString }}</p>

        <ul v-if="!showLoader">
          <li v-for="slot in date.slots" :key="slot.timeString" class="my-1">
            <BaseButton
              :aria-label="`On ${date.dateString} at ${slot.timeString}`"
              class="w-100"
              :variant="selectedSlotDate && isEqualDate(selectedSlotDate, slot.startDate) ? 'primary' : 'primary-light'"
              :class="{ 'text-decoration-line-through': slot.taken }"
              :disabled="slot.taken"
              @click="selectSlot(slot)"
            >
              {{ slot.timeString }}
            </BaseButton>
          </li>
        </ul>
      </div>

      <BaseButton
        aria-label="Show later dates"
        default-class="align-self-start rounded-circle"
        variant="primary-light"
        :disabled="showLoader"
        @click="goNext"
      >
        <v-icon icon="$next" class="ma-1" />
      </BaseButton>
    </div>

    <div v-if="showLoader" class="placeholder text-center text-light py-7 w-100">
      Loading...
    </div>

    <div v-if="isSlotsPreviewEnabled" class="text-center mt-4 pa-1 border-t-sm">
      <BaseButton
        :aria-label="showAllSlots ? 'Show less hours' : 'Show more hours'"
        variant="primary-link"
        @click="showAllSlots = !showAllSlots"
      >
        {{ showAllSlots ? 'Less' : 'Show more hours' }}
        <v-icon :icon="showAllSlots ? '$collapse' : '$expand'" />
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
}

.text-light {
  color: var(--color-text-light);
}

.placeholder {
  min-height: 320px;
}
</style>