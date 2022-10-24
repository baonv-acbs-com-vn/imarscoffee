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
import { createdContent, deleteContent } from '~/model/content.server';

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

  // HANDLE created
  if (action === "CREATED") {
    await createdContent({
      contentDirectory: "item",
      code: "code",
      published: true,
      slug: 'robusta199',
      title: 'robusta',
      description: 'robusta 100% 1kg',
      price: 199000,
      discount: 10,
      imageUrl: "imageUrl",
      state: "new"
     
    })
  }
  return true;
}

type LoaderData = { items: Awaited<ReturnType<typeof getMdxListItems>> }

const [seoMeta, seoLinks] = getSeo({
  title: 'Manage Robusta Arabica Culi',
  description: 'Manage Robusta Arabica Culi',
  twitter: {
    title: 'Manage Robusta Arabica Culi',
    description: 'Manage Robusta Arabica Culi',
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
    { headers: { 'cache-control': 'private, max-age=60', Vary: 'Cookie' }, }
  )
}



export default function Manage() {
  const { items } = useLoaderData<LoaderData>()
  return (
    <section className='mx-auto min-h-screen max-w-4xl pt-4'>
      <Items items={items} />
    </section>
  )
}