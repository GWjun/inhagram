import ActiveLayout from './activeLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <ActiveLayout />
      <main className="flex flex-col grow">{children}</main>
    </div>
  )
}
