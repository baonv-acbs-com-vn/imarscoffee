import * as React from 'react'
import { useLoaderData } from '@remix-run/react'
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import { getMdxListItems } from '~/utils/mdx.server'
import { getSeo } from '~/utils/seo'
import Feature from '~/components/feature'
import CoffeeList from '~/components/coffee-list'

type LoaderData = { coffeeList: Awaited<ReturnType<typeof getMdxListItems>> }

const [seoMeta, seoLinks] = getSeo()

export const meta: MetaFunction = () => {
  return { ...seoMeta }
}

export const links: LinksFunction = () => {
  return [...seoLinks]
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'cache-control':
      loaderHeaders.get('cache-control') ?? 'private, max-age=60',
    Vary: 'Cookie',
  }
}

export const loader: LoaderFunction = async () => {
  const _coffeeList = await getMdxListItems({ contentDirectory: 'item' })

  return json<LoaderData>(
    { coffeeList: _coffeeList.slice(0, 10) },
    { headers: { 'cache-control': 'private, max-age=60' } },
  )
}

export default function Index() {
  const { coffeeList } = useLoaderData<LoaderData>()
  return (
    <>
      <section className='mx-auto'>
        <div className='mx-auto'>
          <Feature />
          <h1 className='mx-center text-center pb-10'>
            Our Products
          </h1>
          <CoffeeList coffeeList={coffeeList}/>
        </div>
      </section>
    </>
  )
}

function GradientText(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className='bg-gradient-to-r from-sky-600 via-pink-500 to-red-600 bg-clip-text text-center text-6xl leading-snug text-transparent dark:via-blue-400 dark:to-green-300'
      {...props}
    />
  )
}
