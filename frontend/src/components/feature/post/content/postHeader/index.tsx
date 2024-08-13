'use client'

import { useRouter } from 'next/navigation'

import { EllipsisVertical } from 'lucide-react'
import { useSession } from 'next-auth/react'

import Alert from '#components/feature/modal/alert'
import UserHeader from '#components/feature/user/userHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'
import { useDeletePostDataMutation } from '#store/server/post.queries'
import { BasicUser } from '#types/user.type'

interface PostHeaderProps {
  postId: number
  user: BasicUser
}

export default function PostHeader({ postId, user }: PostHeaderProps) {
  const { data: session } = useSession()
  const isMe = user.nickname === session?.user?.name
  const router = useRouter()

  const { mutate, status, reset } = useDeletePostDataMutation(session)

  function handleRemove() {
    mutate(postId)
  }

  function handleEdit() {}

  function PostDropDown() {
    if (!isMe) return null
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={18} aria-label="더 보기" />
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
    <>
      <div className="flex justify-between items-center px-1">
        <UserHeader user={user} size="small" />
        <PostDropDown />
      </div>

      <Alert
        isOpen={status === 'success'}
        closeCallback={() => {
          reset()
          router.back()
        }}
        title="알림"
        message="성공적으로 게시물이 삭제되었습니다."
      />
      <Alert
        isOpen={status === 'error'}
        closeCallback={reset}
        title="실패"
        message="삭제에 실패했습니다."
      />
    </>
  )
}
