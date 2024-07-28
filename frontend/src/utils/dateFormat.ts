export function extractTime(dateStr: string): string {
  const utcDate = new Date(dateStr)

  const hours = utcDate.getHours().toString().padStart(2, '0')
  const minutes = utcDate.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

export function extractDate(dateStr: string): string {
  const utcDate = new Date(dateStr)

  const year = utcDate.getFullYear()
  const month = (utcDate.getMonth() + 1).toString().padStart(2, '0')
  const day = utcDate.getDate().toString().padStart(2, '0')

  const weekdays = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ]
  const weekday = weekdays[utcDate.getDay()]

  return `${year}년 ${month}월 ${day}일 ${weekday}`
}
