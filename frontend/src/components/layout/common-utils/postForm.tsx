interface PostFromProps {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
}

export default function PostForm({
  title,
  setTitle,
  content,
  setContent,
  handleSubmit,
}: PostFromProps) {
  return (
    <form onSubmit={handleSubmit} className="h-full">
      <div className="h-[20%] p-3 border-b border-gray-300">
        <textarea
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full h-full px-3 py-2 resize-none focus:outline-none"
        />
      </div>
      <div className="h-[80%] p-3">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="w-full h-full px-3 py-2 resize-none focus:outline-none"
        />
      </div>
    </form>
  )
}
