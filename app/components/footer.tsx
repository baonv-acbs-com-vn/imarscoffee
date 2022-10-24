import * as React from 'react'

import LinkOrAnchor from './link-or-anchor'
import GitHubSvg from '~/assets/icons/github.svg'
import TwitterSvg from '~/assets/icons/twitter.svg'

export function preloadFooterSvg() {
  return [
    { rel: 'preload', href: GitHubSvg, as: 'image', type: 'image/svg+xml' },
    { rel: 'preload', href: TwitterSvg, as: 'image', type: 'image/svg+xml' },
  ]
}

export default function Footer() {
  return (
    <footer >
      <div className='mx-auto  max-w-5xl flex items-start justify-between py-20 '>
        <div className='flex space-x-2'>
          <div>
            <h2 className='pb-2'> iMars_</h2>
            <h4 className='text-gray-400 dark:text-white'>The best Coffee in Viet Nam</h4>
            <h4 className='text-gray-400 dark:text-white'>Lavita Charm - A1_18_21 </h4>
            <h4 className='text-gray-400 dark:text-white'>46 Đường Số 1, Trường Thọ, Thủ Đức, Thành phố Hồ Chí Minh 760000 </h4>
            <h4 className='text-gray-400 dark:text-white'>www.imarscoffee.com</h4>
            <h4 className='text-gray-400 dark:text-white'>+84.962.618.952</h4>
            <h4 className='text-gray-400 dark:text-white'>imarscoffee.com@gmail.com</h4>
          </div>
        </div>
        <div className='flex  space-x-2'>

          <div>
            <h2 className='pb-2'> Menu</h2>
            <h4 className='text-gray-400 dark:text-white'>Robusta is King</h4>
            <h4 className='text-gray-400 dark:text-white'>Arabica is Queen</h4>
            <h4 className='text-gray-400 dark:text-white'>Culi is Hulk</h4>
          </div>
        </div>
        <div className='flex space-x-2'>

          <div>
            <h2 className='pb-2'> Stay connected</h2>
            <h4 className='text-gray-400 dark:text-white'>Facebook</h4>
            <h4 className='text-gray-400 dark:text-white'>Tiktok</h4>
            <h4 className='text-gray-400 dark:text-white'>Instagram</h4>
            <h4 className='text-gray-400 dark:text-white'>Twitter</h4>
            <h4 className='text-gray-400 dark:text-white'>Telegram</h4>
            <h4 className='text-gray-400 dark:text-white'>Youtube</h4>
          </div>
        </div>

      </div>

    </footer>
  )
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6 text-gray-500 dark:text-gray-300'
    >
      {children}
    </svg>
  )
}

function Link({
  children,
  href,
  reload,
}: {
  children: React.ReactNode
  href: string
  reload?: boolean
}) {
  return (
    <li>
      <LinkOrAnchor
        href={href}
        reloadDocument={reload}
        className='text-xl text-gray-600 dark:text-gray-200'
        prefetch={!href.includes(':') ? 'intent' : 'none'}
      >
        {children}
      </LinkOrAnchor>
    </li>
  )
}
