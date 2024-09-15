'use client'

import Image, { ImageProps } from 'next/image'

import { useRef, useState } from 'react'

export default function ImageSync({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  console.log(loaded)

  return (
    <Image
      ref={imageRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onLoad={() => setLoaded(true)}
      priority
      {...props}
    />
  )
}
