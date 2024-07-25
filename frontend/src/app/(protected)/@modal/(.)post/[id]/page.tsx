'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#components/ui/dialog'
import { useGetPostQuery } from '#store/server/post.queries'

export default function PostModal({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState(true)
  const [isImageLoad, setIsImageLoad] = useState(false)

  const { data, isError, refetch } = useGetPostQuery(params.id)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialogOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.addEventListener('keydown', handleKeyDown)
  }, [])

  function handleOutsidePage() {
    setDialogOpen(false)
    router.back()
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogContent
        onInteractOutside={handleOutsidePage}
        className="h-full max-w-[90vw] max-h-[60vh] md:max-w-[70vw] md:max-h-[90vh] p-0"
      >
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {data?.images.map((image, index) => (
              <CarouselItem key={index}>
                <div key={index} className="relative w-full h-full">
                  {!isImageLoad && <LoadingSpinner variant="inset" />}
                  <Image
                    src={image.path}
                    alt={`Post image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 70vw, 60vw"
                    onLoad={() => setIsImageLoad(true)}
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 md:-left-16 disabled:pointer-events-auto" />
          <CarouselNext className="right-4 md:-right-16 disabled:pointer-events-auto" />
        </Carousel>

        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <Alert
          isOpen={isError}
          closeCallback={refetch}
          title="실패"
          message="게시물을 불러오는데 실패했습니다."
        />
      </DialogContent>
    </Dialog>
  )
}
