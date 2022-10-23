import { Form } from '@remix-run/react'
import type { getMdxListItems } from '~/utils/mdx.server'
import Item from './item'

type ItemsType = { items: Awaited<ReturnType<typeof getMdxListItems>> }

export default function Items({ items }: ItemsType) {
  return (
    <div className='flex flex-col'>
      {items.map(item => (
        <div key={item.slug}>
          <Item  {...item} />
          <Form method='post' action='/mana'>
            <input type="hidden" value={item.slug} name='slug' />
            <button type="submit" name='action' value='DELETE'>DELETE</button>
          </Form>
        </div>
      ))}
    </div>
  )
}
