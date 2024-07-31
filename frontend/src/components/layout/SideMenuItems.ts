import {
  Compass,
  Film,
  Heart,
  Home,
  PlusSquare,
  Search,
  Send,
} from 'lucide-react'

export const SideMenuItems = [
  { name: '홈', icon: Home, path: '/' },
  { name: '검색', icon: Search },
  { name: '탐색', icon: Compass, path: '/explore' },
  { name: '릴스', icon: Film, path: '/reels' },
  { name: '메시지', icon: Send, path: '/direct' },
  { name: '알림', icon: Heart },
  { name: '만들기', icon: PlusSquare },
]

export const FooterMenuItem = [
  { name: '홈', icon: Home, path: '/' },
  { name: '탐색', icon: Compass, path: '/explore' },
  { name: '릴스', icon: Film, path: '/reels' },
  { name: '만들기', icon: PlusSquare },
  { name: '메시지', icon: Send, path: '/direct' },
]

export const ProfileItemGenerator = (username: string) => ({
  name: '프로필',
  icon: Home,
  path: `/${username}`,
})
