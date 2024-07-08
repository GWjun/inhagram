import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="images/static/instagram-logo-outline.svg"
        width={70}
        height={0}
        alt="loading icon"
        priority
      />
    </div>
  )
}
