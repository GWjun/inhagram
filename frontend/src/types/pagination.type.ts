interface Cursor {
  after: string | null
}
export default interface PaginationType {
  cursor: Cursor
  count: number
  next: string | null
}
