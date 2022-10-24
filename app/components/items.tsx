import { Form } from '@remix-run/react'
import type { getMdxListItems } from '~/utils/mdx.server'
import Item from './item'

type ItemsType = { items: Awaited<ReturnType<typeof getMdxListItems>> }

export default function Items({ items }: ItemsType) {
  return (
    <div className='flex flex-col pb-10'>
      <h1 className='text-left py-4' hidden={items.length == 0}>
        Our Products
      </h1>
      <div className='gap-2 grid  grid-cols-1 lg:grid-cols-4'>
        {items.length > 0 && items.map((item, index) => (
          <div key={item.slug} className='bg-gray-50 p-4'>
            <h2>#{index}</h2>
            <Form method='post' action='/manage'>
              <input className='bg-red-100' type="hidden" value={item.slug} name='slug' />
              <button className='bg-red-100 text-red-400 mt-2  px-4 mr-2 border-2 border-red-500 rounded-full ' type="submit" name='action' value='DELETE'>DELETE</button>
              <button className='bg-blue-100  text-blue-400 mt-2  px-4 border-2 border-blue-500 rounded-full ' type="submit" name='action' value='EDIT'>EDIT</button>
            </Form>
            <Item  {...item} />
          </div>
        ))}
      </div>
      <hr className="w-auto h-1 bg-gray-100 rounded border-0 md:my-10 dark:bg-gray-700" />
      <h1 className='text-left py-4'>
        Create
      </h1>
      <Form method='post' action='/manage' className='text-gray-500 gap-1 grid grid-cols-3'>
        <input className='bg-gray-50 p-1 border border-gray-100' name='slug' placeholder="Slug for seo" />
        <input className='bg-gray-50 p-1 border border-gray-100' name='title' placeholder="Title" />
        <input className='bg-gray-50 p-1 border border-gray-100' name='description' placeholder="Description" />
        <input className='bg-gray-50 p-1 border border-gray-100' name='price' defaultValue={0} placeholder="Price" type={'number'} min={0} />
        <input className='bg-gray-50 p-1 border border-gray-100' name='discount' defaultValue={0} placeholder="Discount" type={'number'} min={0} max={100} />
        <input className='bg-gray-50 p-1 border border-gray-100' name='imageUrl' placeholder="ImageUrl" />
        <div></div>
        <button className='bg-teal-100 text-teal-400 mt-2 px-4 w-40 m-auto rounded-full' type="submit" name='action' value='CREATED'>Add</button>
      </Form>
    </div>
  )
}