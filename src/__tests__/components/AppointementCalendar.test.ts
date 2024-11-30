import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import AppointmentCalendar from "@/components/AppointmentCalendar.vue"
import fakeTimeSlots from "@/__tests__/mocks/fakeTimeSlots.json"
import type { TimeSlot } from "@/types/Appointment"

const props = {
  startDate: new Date("2024-12-09T14:48:00"),
  endDate: new Date("2024-12-15T14:48:00"),
  slots: fakeTimeSlots.map((slot) => ({
    startDate: new Date(slot.Start),
    endDate: new Date(slot.End),
    taken: slot.Taken || false
  })) satisfies TimeSlot[]
}

describe("components/AppointmentCalendar", () => {
  beforeEach(() => {
    vi.setSystemTime("2024-12-05T14:48:00")
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows a loading state", () => {
    const wrapper = mount(AppointmentCalendar, { props: {
      ...props,
      showLoader: true 
    }})

    expect(wrapper.text()).contain("Loading...")
  })

  it("renders all days", () => {
    const wrapper = mount(AppointmentCalendar, { props })

    const renderedText = wrapper.text()

    expect(renderedText).contain("9 Dec")
    expect(renderedText).contain("11 Dec")
    expect(renderedText).contain("10 Dec")
    expect(renderedText).contain("12 Dec")
    expect(renderedText).contain("13 Dec")
    expect(renderedText).contain("14 Dec")
    expect(renderedText).contain("15 Dec")
  })

  it("disables slots which have been booked", async () => {
    const wrapper = mount(AppointmentCalendar, { props })

    const availableSlot = wrapper.find("[aria-label='On 9 Dec at 10:50']")
    const busySlot = wrapper.find("[aria-label='On 9 Dec at 10:40']")

    expect(availableSlot.exists()).toBe(true)
    expect(availableSlot.attributes("disabled")).toBeUndefined()

    expect(busySlot.exists()).toBe(true)
    expect(busySlot.attributes("disabled")).not.toBeUndefined()
  })

  it("emits event when the user navigates to other dates", async () => {
    const wrapper = mount(AppointmentCalendar, { props })

    const prevBtn = wrapper.find("[aria-label='Show earlier dates']")
    const nextBtn = wrapper.find("[aria-label='Show later dates']")

    await prevBtn.trigger("click")
    expect(wrapper.emitted()).toHaveProperty("goPrev")

    await nextBtn.trigger("click")
    expect(wrapper.emitted()).toHaveProperty("goNext")
  })

  it("shows more time slots", async () => {
    const wrapper = mount(AppointmentCalendar, { props })

    const showMore = wrapper.find("[aria-label='Show more hours']")
    const collapsedTimeSlotsCount = wrapper.findAll("ul")[0].findAll("li").length

    await showMore.trigger("click")

    const expandedTimeSlotsCount = wrapper.findAll("ul")[0].findAll("li").length

    expect(collapsedTimeSlotsCount).toBeLessThan(expandedTimeSlotsCount)
  })
})