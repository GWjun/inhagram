import ProfileItem from '#components/layout/sidebar-utils/item/profileItem'
import RenderMenuItem from '#components/layout/sidebar-utils/item/randerMenuItem'
import { SideMenuItems } from '#components/layout/SideMenuItems'

export default function SideNavItem() {
  return (
    <nav>
      <ul>
        {SideMenuItems.map((item) => (
          <li key={item.name}>
            <RenderMenuItem item={item} />
          </li>
        ))}
        <li>
          <ProfileItem />
        </li>
      </ul>
    </nav>
  )
}
