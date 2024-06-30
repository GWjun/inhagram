import Footer from '#components/layout/footer'
import Sidebar from '#components/layout/slidebar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      {children}
      <Footer />
    </>
  )
}
