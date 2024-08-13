import { useRouter } from 'next/navigation'

import { Ellipsis } from 'lucide-react'
import { useSession } from 'next-auth/react'

import ImageWithLoad from '#components/feature/image/imageWithLoad'
import Alert from '#components/feature/modal/alert'
import { Avatar } from '#components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'
import { useDeleteCommentDataMutation } from '#store/server/comment.queries'
import { Comment } from '#types/comments.type'
import { formatTimeDifference } from '#utils/dateFormat'

interface PostCommentProps {
  postId: number
  commentData: Comment
}

export default function PostComment({ postId, commentData }: PostCommentProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const isMe = commentData.author.nickname === session?.user?.name
  const { updateAt, comment, likeCount, author } = commentData

  const { mutate, status, reset } = useDeleteCommentDataMutation(
    postId,
    session,
  )

  const date = formatTimeDifference(updateAt)

  function handleClick() {
    router.push(`/${author.nickname}`)
  }

  function handleRemove() {
    mutate(commentData.id)
  }

  function handleEdit() {}

  function CommentDropDown() {
    if (!isMe) return null
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis
            onClick={() => console.log('clikced')}
            size={18}
            aria-label="더 보기"
            className="opacity-0 group-hover:opacity-100 hover:cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleEdit}
            className="justify-center py-2"
          >
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleRemove}
            className="justify-center py-2 text-destructive focus:text-destructive"
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex group w-full">
      <Avatar className="w-8 h-8" onClick={handleClick}>
        <ImageWithLoad
          src={author.image || '/images/assets/avatar-default.jpg'}
          alt="user avatar"
          width={32}
          height={32}
          className="object-cover rounded-full"
          loading="eager"
        />
      </Avatar>
      <div className="flex flex-col ml-3 gap-1 flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-1">
          <div
            className="font-medium text-sm"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick()
            }}
          >
            {author.nickname}
          </div>
          <p className="text-sm break-words max-w-full">{comment}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <p>{date}</p>
          <p>좋아요 {likeCount}개</p>
          <CommentDropDown />
        </div>
      </div>

      <Alert
        isOpen={status === 'error'}
        closeCallback={reset}
        title="실패"
        message="삭제에 실패했습니다."
      />
    </div>
  )
}
