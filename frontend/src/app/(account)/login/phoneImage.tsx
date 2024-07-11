import Image from 'next/image'

import Slideshow from '#components/feature/slidshow'

import homePhone from '../../../../public/images/login/home-phones.png'
import screen1 from '../../../../public/images/login/screenshot1.png'
import screen2 from '../../../../public/images/login/screenshot2.png'
import screen3 from '../../../../public/images/login/screenshot3.png'
import screen4 from '../../../../public/images/login/screenshot4.png'

function PhoneImage() {
  return (
    <div className="hidden lg:flex relative">
      <Image
        src={homePhone}
        width={460}
        height={0}
        alt="instagram Home Phones"
        priority
        decoding="sync"
      />
      <Slideshow
        images={[screen1, screen2, screen3, screen4]}
        interval={5000}
        className="absolute right-14 top-6"
      />
    </div>
  )
}

export default PhoneImage
