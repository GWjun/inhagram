'use client'

import { useRef } from 'react'

import { useSession } from 'next-auth/react'

import { AvatarImage } from '#components/ui/avatar'
import { UserImageResponse, useUserImageStore } from '#store/client/user.store'
import authFetch from '#utils/authFetch'

export default function AvatarInput() {
  const { data: session } = useSession()

  const { imageUrl, setUserImage } = useUserImageStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const imageUrl = await authFetch<UserImageResponse>(
          '/common/image/user',
          {
            method: 'POST',
            body: formData,
          },
          session,
        )
        setUserImage(imageUrl.path)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  return (
    <>
      <AvatarImage
        src={imageUrl || 'images/avatar-default.jpg'}
        className="object-cover"
      />
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-full cursor-pointer"
        onClick={handleAvatarClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleAvatarClick()
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </>
  )
}
