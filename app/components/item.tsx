import type { getMdxListItems } from '~/utils/mdx.server'

type ItemType = Awaited<ReturnType<typeof getMdxListItems>>[0]

export default function Item({  description, slug, title, price, discount, imageUrl, state }: ItemType) {
  return (
    <div className='flex flex-col gap-2'>
       <h2>Title: {title}</h2>
       <h3>Description: {description}</h3>
       <h3>Price: {price} đồng</h3>
       <h3>Discount: -{discount}%</h3>
       <h3>Image Url: {imageUrl}</h3>
       <h3>State: {state}</h3>
       <h3>Slug: #{slug}</h3>
    </div>
  )
}
