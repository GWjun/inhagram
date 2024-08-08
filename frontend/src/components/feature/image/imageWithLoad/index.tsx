'use client'

import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'

import type { ImageProps } from 'next/dist/shared/lib/get-img-props'

import Loading from '../../../../app/loading'

export default function ImageWithLoad({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setLoaded(true)}
        {...props}
        priority
      />

      {!loaded && <Loading />}
    </>
  )
}
