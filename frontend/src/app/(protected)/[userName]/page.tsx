export default function UserProfile({
  params,
}: {
  params: { userName: string }
}) {
  return (
    <section className="flex min-h-full justify-center items-center">
      {params.userName}
    </section>
  )
}
