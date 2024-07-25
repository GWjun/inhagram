import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-[50] pointer-events-none">
      <Image
        src="images/static/instagram-logo-outline.svg"
        width={70}
        height={70}
        alt="loading icon"
        priority
      />
    </div>
  )
}
