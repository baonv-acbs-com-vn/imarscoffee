import { Form } from '@remix-run/react'
import type { getMdxListItems } from '~/utils/mdx.server'
import Item from './item'

type ItemsType = { items: Awaited<ReturnType<typeof getMdxListItems>> }

export default function Items({ items }: ItemsType) {
  return (
    <div className='flex flex-col'>
      <h1 className='text-left py-4' hidden={items.length == 0}>
        Our Products
      </h1>
      {items.length > 0 && items.map(item => (
        <div key={item.slug}>
          <Item  {...item} />
          <Form method='post' action='/manage'>
            <input className='bg-red-100' type="hidden" value={item.slug} name='slug' />
            <button className='bg-red-100 px-4 text-red-400 mt-2 mr-2 border-2 border-red-500' type="submit" name='action' value='DELETE'>DELETE</button>
            <button className='bg-blue-100 px-4 text-blue-400 mt-2 border-2 border-blue-500' type="submit" name='action' value='EDIT'>EDIT</button>
          </Form>
        </div>
      ))}
      <h1 className='text-left py-4'>
        Create
      </h1>
      <Form method='post' action='/manage' className='flex flex-col gap-2 border-2 border-teal-50 dark:border-teal-500'>
        <input className='bg-teal-50 p-2 border border-teal-100' name='slug' placeholder="Slug for seo"/>
        <input className='bg-teal-50 p-2 border border-teal-100' name='title' placeholder="Title"/>
        <input className='bg-teal-50 p-2 border border-teal-100' name='description' placeholder="Description"/>
        <input className='bg-teal-50 p-2 border border-teal-100' name='price' placeholder="Price"/>
        <input className='bg-teal-50 p-2 border border-teal-100' name='url' placeholder="Url image"/>
        <button className='bg-teal-400 p-2 text-white' type="submit" name='action' value='CREATED'>Add</button>
      </Form>
    </div>
  )
}
