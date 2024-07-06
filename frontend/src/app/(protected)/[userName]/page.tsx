export default function UserProfile({
  params,
}: {
  params: { userName: string }
}) {
  return (
    <main className="flex min-h-full justify-center items-center">
      {params.userName}
    </main>
  )
}
