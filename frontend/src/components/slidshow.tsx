import Image from 'next/image'

import { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

interface SlideshowProps {
  images: string[]
  interval?: number
  className?: string
}

export default function Slideshow({
  images,
  interval = 3000,
  className,
}: SlideshowProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(slideInterval)
  }, [images.length, interval])

  return (
    <AnimatePresence>
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className={className}
      >
        <Image
          src={images[index]}
          alt={`Slideshow image ${index + 1}`}
          width={250}
          height={0}
        />
      </motion.div>
    </AnimatePresence>
  )
}
