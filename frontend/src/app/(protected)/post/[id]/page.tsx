import Post from '#components/feature/post'

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-[100vh] md:min-h-full justify-center pb-12 md:mt-9">
      <div className="flex flex-col w-full max-w-[900px]">
        <div className="max-w-[100vw] h-full md:h-[50%] md:border border-gray-300 rounded-lg">
          <Post postId={params.id} />
        </div>
      </div>
    </div>
  )
}
