import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#components/ui/alert-dialog'

interface AlertProps {
  isOpen: boolean
  closeCallback: () => void
  title: string
  message: string
}

export default function Alert({
  isOpen,
  closeCallback,
  title,
  message,
}: AlertProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="w-[80vw] rounded-lg sm:w-full h-[25vh] p-0 grid-rows-[70%_1fr] gap-0">
        <AlertDialogHeader className="p-6">
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-3">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="h-full w-full rounded-t-none bg-white text-black border-t border-gray-200 hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={closeCallback}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
