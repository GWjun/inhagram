'use client'

import { Fragment } from 'react'

import ProfileItem from '#components/layout/footer-utils/item/profileItem'
import { RenderMenuItem } from '#components/layout/footer-utils/item/randerMenuItem'
import { FooterMenuItem } from '#components/layout/SideMenuItems'

export default function Footer() {
  return (
    <footer className="md:hidden fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-300">
      <nav className="flex justify-evenly items-center h-12">
        {FooterMenuItem.map((item) => (
          <Fragment key={item.name}>
            <RenderMenuItem item={item} />
          </Fragment>
        ))}

        <ProfileItem />
      </nav>
    </footer>
  )
}
