import {
  Bookmark,
  Menu,
  MessageSquareWarning,
  Settings,
  SquareActivity,
  Sun,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'
import { useShrinkStore } from '#store/client/sidebar.store'
import { cn } from 'utils/utils'

export default function ModalMenu() {
  const isShrink = useShrinkStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center p-3 mb-1 hover:bg-gray-light rounded-lg w-full group">
        <Menu
          className={cn(
            'xl:mr-4 min-w-6 min-h-6 group-hover:scale-110 transition duration-200 ease-in-out',
            isShrink && 'xl:mr-0',
          )}
          aria-label="더 보기"
        />
        <span
          className={cn(
            'hidden xl:inline whitespace-nowrap',
            isShrink && 'xl:hidden',
          )}
        >
          더 보기
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="hidden md:flex flex-col w-[266px] h-[404.5px] relative top-14 left-14 xl:left-3 xl:top-0 3xl:-left-[23px] rounded-2xl shadow-lg">
        <DropdownMenuItem className="h-[50px]">
          <Settings size={18} className="mr-3" aria-label="설정" />
          <span>설정</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <SquareActivity size={18} className="mr-3" aria-label="내 활동" />
          <span>내 활동</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <Bookmark size={18} className="mr-3" aria-label="저장됨" />
          <span>저장됨</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <Sun size={18} className="mr-3" aria-label="모드 전환" />
          <span>모드 전환</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <MessageSquareWarning
            size={18}
            className="mr-3"
            aria-label="문제 신고"
          />
          <span>문제 신고</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-2 my-2 h-[6px] w-[266px]" />
        <DropdownMenuItem className="h-[50px]">
          <span>계정 전환</span>
        </DropdownMenuItem>
        <div className="-mx-2 my-2 bg-gray-light w-[266px] h-[0.5px]" />
        <DropdownMenuItem
          className="h-[50px]"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
