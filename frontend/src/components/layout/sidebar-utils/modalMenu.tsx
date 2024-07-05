import {
  Bookmark,
  Menu,
  MessageSquareWarning,
  Settings,
  SquareActivity,
  Sun,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'
import { cn } from 'utils/utils'

export default function ModalMenu({ isModalOpen }: { isModalOpen: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center p-3 mb-1 hover:bg-gray-light rounded-lg w-full group">
        <Menu
          className={cn(
            'xl:mr-4 min-w-6 min-h-6 group-hover:scale-110 transition duration-200 ease-in-out',
            isModalOpen && 'xl:mr-0',
          )}
        />
        <span
          className={cn(
            'hidden xl:inline whitespace-nowrap',
            isModalOpen && 'xl:hidden',
          )}
        >
          더 보기
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="hidden md:flex flex-col w-[266px] h-[404.5px] relative top-14 left-14 xl:left-3 xl:top-0 3xl:-left-[23px] rounded-2xl shadow-lg">
        <DropdownMenuItem className="h-[50px]">
          <Settings size={18} className="mr-3" />
          <span>설정</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <SquareActivity size={18} className="mr-3" />
          <span>내 활동</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <Bookmark size={18} className="mr-3" />
          <span>저장됨</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <Sun size={18} className="mr-3" />
          <span>모드 전환</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[50px]">
          <MessageSquareWarning size={18} className="mr-3" />
          <span>문제 신고</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-2 my-2 h-[6px] w-[266px]" />
        <DropdownMenuItem className="h-[50px]">
          <span>계정 전환</span>
        </DropdownMenuItem>
        <div className="-mx-2 my-2 bg-gray-light w-[266px] h-[0.5px]" />
        <DropdownMenuItem className="h-[50px]">
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
