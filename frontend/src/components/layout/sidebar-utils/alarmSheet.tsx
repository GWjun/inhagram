import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#components/ui/sheet'

interface SheetProps {
  children: React.ReactNode
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
  onClick?: () => void
}

export default function AlarmSheet({
  children,
  setIsModalOpen,
  ...props
}: SheetProps) {
  return (
    <Sheet onOpenChange={(open: boolean) => setIsModalOpen(open)}>
      <SheetTrigger className={props.className} onClick={props.onClick}>
        {children}
      </SheetTrigger>
      <SheetContent side="left_on_sidebar">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
