import { Link } from '@remix-run/react'
import type { getMdxListItems } from '~/utils/mdx.server'

type CoffeeItemType = Awaited<ReturnType<typeof getMdxListItems>>[0]

export default function CoffeeItem({ description, slug, title, price, discount, imageUrl, state }: CoffeeItemType) {
  return (
    <div className='bg-teal-50  border-b-2 border-teal-400 dark:bg-transparent  dark:border-slate-200  border-solid dark:border-b-2 relative' >
      <Link
        prefetch='intent'
        to={`/coffee/${slug}`}
        className='flex flex-col gap-2 no-underline'
      >
        <img className='object-fill' src={imageUrl} alt="" />
        <div className='py-24'></div>
        <div className='p-4'>
          <h3 className=''>
            {title}
          </h3>
          <h4 className='text-gray-400'>
            {description}
          </h4>
          <div className='absolute flex items-center h-10 w-10 left-2 top-2  rounded-full  bg-red-300'>
            <h4 className='m-auto text-white dark:text-white'>{`-${discount}%`}</h4>
          </div>
          <div className='absolute  flex items-center h-10 w-10 right-2 top-2  rounded-full  bg-teal-400'>
            <h4 className='m-auto text-white dark:text-white'>{state}</h4>
          </div>
          <h3 className=''>
            {`${price} đồng`}
          </h3>
        </div>
      </Link>
    </div>
  )
}
