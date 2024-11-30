import { describe, it, expect } from 'vitest';
import { getFullDateString, getShortDateString, getDayOfWeekString, getDayMonthString, getTime24String, getDatesRange } from '../../utils/date';

describe('utils/dates', () => {
  const testDate = new Date('2023-10-05T14:48:00')

  it('should format full date string correctly', () => {
    const result = getFullDateString(testDate)
    expect(result).toBe('Thursday, 5 Oct 2023 at 14:48')
  })

  it('should format short date string correctly', () => {
    const result = getShortDateString(testDate)
    expect(result).toBe('2023-10-05')
  })

  it('should format day of week string correctly', () => {
    const result = getDayOfWeekString(testDate)
    expect(result).toBe('Thu');
  })

  it('should format day and month string correctly', () => {
    const result = getDayMonthString(testDate)
    expect(result).toBe('5 Oct');
  })

  it('should format time in 24-hour format correctly', () => {
    const result = getTime24String(testDate)
    expect(result).toBe('14:48')
  })

  it('should return correct dates range', () => {
    const startDate = new Date('2023-10-01T14:48:00')
    const endDate = new Date('2023-10-05T14:48:00')
    const result = getDatesRange(startDate, endDate)

    expect(result.length).toEqual(5)
  })

  it('should return the single date', () => {
    const result = getDatesRange(testDate, testDate)
    expect(result.length).toEqual(1)
  })
})