import Image from 'next/image'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#components/ui/carousel'
import { Page, usePageStore, useUrlStore } from '#store/client/makepost.store'
import { cn } from '#utils/utils'

export default function MakeImageContent() {
  const page = usePageStore((state) => state.page)
  const previewUrls = useUrlStore((state) => state.previewUrls)

  return (
    <Carousel className="md:min-w-[500px] lg:min-w-[698px] 2xl:min-w-[868px] w-full h-full bg-gray-100 rounded-b-xl">
      <CarouselContent className="h-full">
        {previewUrls.map((url, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={`Uploaded image ${index + 1}`}
                className={cn(
                  'object-contain',
                  page !== Page.Image && 'rounded-br-none',
                )}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-black/70 text-white hover:bg-black/70 hover:text-white disabled:hidden" />
      <CarouselNext className="right-4 bg-black/70 text-white hover:bg-black/70 hover:text-white disabled:hidden" />
    </Carousel>
  )
}
