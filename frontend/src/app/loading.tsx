import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-[9999] pointer-events-none">
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
