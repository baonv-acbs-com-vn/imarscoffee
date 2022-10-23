import type { getMdxListItems } from '~/utils/mdx.server'

type ItemType = Awaited<ReturnType<typeof getMdxListItems>>[0]

export default function Item({ description, slug, title }: ItemType) {
  return (
    <div className='flex gap-2'>
      {/* <input value={title} className=''>
      </input>
      <input value={description} className=''>
      </input> */}
      <p>
        {title + " - " + slug + " - " + description}
      </p>
    </div>
  )
}
