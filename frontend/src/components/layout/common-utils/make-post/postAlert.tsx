import { Dispatch, SetStateAction } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#components/ui/alert-dialog'
import { resetAllStores } from '#store/client/makepost.store'

interface PostAlertProps {
  alertOpen: boolean
  setAlertOpen: Dispatch<SetStateAction<boolean>>
  setDialogOpen: Dispatch<SetStateAction<boolean>>
}

export default function PostAlert({
  alertOpen,
  setAlertOpen,
  setDialogOpen,
}: PostAlertProps) {
  return (
    <AlertDialog open={alertOpen}>
      <AlertDialogContent className="w-[90vw] max-w-[400px] h-[200px] rounded-lg p-0 grid-rows-[auto_1fr] gap-0">
        <AlertDialogHeader className="p-6">
          <AlertDialogTitle className="text-center">
            게시물을 삭제하시겠어요?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            지금 나가면 수정 내용이 저장되지 않습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full h-full sm:flex-col-reverse sm:space-x-0 sm:justify-start">
          <AlertDialogAction
            onClick={() => setAlertOpen(false)}
            className="h-[50%] rounded-t-none bg-white text-black border-t border-gray-200 hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            취소
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => {
              setAlertOpen(false)
              setDialogOpen(false)
              resetAllStores()
            }}
            className="h-[50%] mt-0 rounded-none text-destructive font-bold hover:bg-white hover:text-destructive focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            삭제
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
