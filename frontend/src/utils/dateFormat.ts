export function convertToKoreanTime(date: Date): Date {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000)
}

export function extractTime(dateStr: string): string {
  const utcDate = new Date(dateStr)
  const date = convertToKoreanTime(utcDate)

  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

export function extractDate(dateStr: string): string {
  const utcDate = new Date(dateStr)
  const date = convertToKoreanTime(utcDate)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const weekdays = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ]
  const weekday = weekdays[date.getDay()]

  return `${year}년 ${month}월 ${day}일 ${weekday}`
}
