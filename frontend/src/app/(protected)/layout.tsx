import ActiveLayout from './activeLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ActiveLayout />
      {children}
    </>
  )
}
