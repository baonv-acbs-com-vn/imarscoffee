import type {
  ActionFunction,
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { useLoaderData } from '@remix-run/react'
import Items from '~/components/items'
import { getMdxListItems } from '~/utils/mdx.server'
import { getSeo } from '~/utils/seo'
import { deleteContent } from '~/model/content.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  let { action, ...values } = Object.fromEntries(formData)


  // HANDLE DELETE
  if (action === "DELETE") {
    await deleteContent(values['slug'].toString())
  }
  // HANDLE EDIT
  if (action === "EDIT") {
    // await deleteContent(values["id"]?.toString()!)
  }
  return true;
}

type LoaderData = { items: Awaited<ReturnType<typeof getMdxListItems>> }

const [seoMeta, seoLinks] = getSeo({
  title: 'Item Manager',
  description: 'Item Manager ',
  twitter: {
    title: 'Item Manager',
    description: 'Item Manager',
  },
})

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
  const items = await getMdxListItems({ contentDirectory: 'blog' })

  return json<LoaderData>(
    { items },
    {
      headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' },
    },
  )
}



export default function Mana() {
  const { items } = useLoaderData<LoaderData>()
  return (
    <section className='mx-auto min-h-screen max-w-4xl pt-24'>
      <Items items={items} />
    </section>
  )
}
