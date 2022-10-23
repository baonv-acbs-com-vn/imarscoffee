import type { getMdxListItems } from '~/utils/mdx.server'
import CoffeeItem from './coffee-item'

type CoffeeListType = { coffeeList: Awaited<ReturnType<typeof getMdxListItems>> }

export default function CoffeeList({ coffeeList }: CoffeeListType) {
  return (
      <div>
        <div className='grid grid-cols-4 gap-4'>
      {coffeeList.map(coffeeItem => (
        <CoffeeItem key={coffeeItem.slug} {...coffeeItem} />
      ))}
    </div>
        <h3 className='text-center py-8'>Show More</h3>
      </div>
  )
}

