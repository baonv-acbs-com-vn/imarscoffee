import type { Content } from '@prisma/client'
import {
  deleteContent,
  getContent,
  getContentList,
  getMdxCount,
  requiresUpdate,
  upsertContent as upsertContentImpl,
} from '~/model/content.server'
import type { MdxPage } from '~/types'
import { compileMdx } from './compile-mdx.server'
import { downloadDirectoryList, downloadMdxOrDirectory } from './github.server'

async function dirList(dir: string) {
  const basePath = `content/${dir}`
  const dirList = await downloadDirectoryList(basePath)

  return dirList.map(({ name, path }) => {
    return {
      name,
      slug: path.replace(`${basePath}/`, '').replace(/.mdx?$/, ''),
    }
  })
}

async function downloadMdx(
  filesList: Array<{ slug: string }>,
  contentDir: string,
) {
  return Promise.all(
    filesList.map(async ({ slug }) => {
      const path = `${contentDir}/${slug}`

      return {
        ...(await downloadMdxOrDirectory(path)),
        path,
        slug,
      }
    }),
  )
}

async function compileMdxPages(pages: Awaited<ReturnType<typeof downloadMdx>>) {
  return Promise.all(
    pages.map(async ({ files, slug }) => {
      const compiledPage = await compileMdx<MdxPage['frontmatter']>({
        files,
        slug,
      })
      
      if (!compiledPage) {
        // https://sqliteviewer.flowsoft7.com
        // await deleteContent(slug)
        return null
      }

      return {
        ...compiledPage,
        slug,
      }
    }),
  )
}

async function upsertContent(
  compiledPages: Awaited<ReturnType<typeof compileMdxPages>>,
  contentDirectory: string,
) {
  return Promise.all(
    compiledPages.map(compiledPage => {
      if (compiledPage) {
        return upsertContentImpl({
          contentDirectory,
          code: compiledPage.code,
          frontmatter: compiledPage.frontmatter,
          published: compiledPage.frontmatter.published ?? false,
          slug: compiledPage.slug,
          title: compiledPage.frontmatter.title ?? '',
          timestamp: new Date(compiledPage.frontmatter.date ?? ''),
          description: compiledPage.frontmatter.description ?? '',
          price: compiledPage.frontmatter.price ?? 0,
          discount: compiledPage.frontmatter.discount ?? 0,
          imageUrl: compiledPage.frontmatter.imageUrl ?? '',
          state: compiledPage.frontmatter.state ?? 'none',
        })
      }
      return null
    }),
  )
}

async function populateMdx(contentDirectory: string) {
  const filesList = await dirList(contentDirectory)
  const pages = await downloadMdx(filesList, contentDirectory)
  const compiledPages = await compileMdxPages(pages)
  await upsertContent(compiledPages, contentDirectory)
}

async function updateMdx(mdxToUpdate: Content[], contentDirectory: string) {
  const pages = await downloadMdx(mdxToUpdate, contentDirectory)
  const compiledPages = await compileMdxPages(pages)
  await upsertContent(compiledPages, contentDirectory)
}

export async function getMdxListItems({
  contentDirectory,
}: {
  contentDirectory: string
}) {
  const [count, pagesToUpdates] = await Promise.all([
    getMdxCount(contentDirectory),
    requiresUpdate(contentDirectory),
  ])
  console.log(`🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳  ${JSON.stringify([count, pagesToUpdates])} count, pagesToUpdates`)
  // if (count === 0) {
    await populateMdx(contentDirectory)
  // }
  // if (pagesToUpdates && pagesToUpdates.length > 0) {
  //   await updateMdx(pagesToUpdates, contentDirectory)
  // }

  return getContentList()
}

/**
 * function which returns the compiled MDX page
 * and the meta info for a given slug and the
 * content directory.
 *
 * If the page is not pre compiled or requires update,
 * the page is fetched, compiled and returned
 *
 * The refreshed page is not persisted in DB
 * because of a corner case. Let's say you deploy
 * the app to a new Fly region which has a fresh
 * data store. If the user vists the page directly via
 * a link, since we don't have that page in our cache,
 * we go and download the page, compile MDX and now
 * if we try to persist it in our DB, we will end up
 * in a situation where we might not be able to fetch the
 * rest of the pages when we vist the index route.
 *
 * Because we don't store the total count of pages,
 * there is no way to know if we have downloaded and
 * cached all the pages.
 *
 * You may as why not have a count. Yeah we can, but hey
 * this is a simple starter to get started
 * and feel free to rewrite this block as per you requirement :).
 */
export async function getMdxPage({
  slug,
  contentDirectory,
}: {
  slug: string
  contentDirectory: string
}): ReturnType<typeof getContent> {

 try {
  const data = await getContent(slug)
  console.log(`🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳  ${JSON.stringify(data)}`)
  
  if (data && !data.requiresUpdate) {
    return data
  }
 } catch (error) {
  console.error(`🛑 Error getContent ${slug} ${error}`)
 }
 
  try {
    const pages = await downloadMdx([{ slug }], contentDirectory)
    console.log(`🛠 pages => ${JSON.stringify(pages)}`)
    const [compiledPage] = await compileMdxPages(pages)
    console.log(`🛠 compiledPage  ${compiledPage}`)
  if (!compiledPage) {
    console.error(`🛑 Page ${slug}  fnc downloadMdx compileMdxPages`)
    return null
  }

  if (!compiledPage.frontmatter.published) {
    return null
  }
  console.log(`🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 ${JSON.stringify(compiledPage)}`)
  return {
    code: compiledPage.code,
    contentDirectory,
    frontmatter: compiledPage.frontmatter,
    requiresUpdate: false,
    slug,
    timestamp: new Date(compiledPage.frontmatter.date ?? ''),
    title: compiledPage.frontmatter.title ?? '',
    description: compiledPage.frontmatter.description ?? '',
    price: compiledPage.frontmatter.price ?? 0,
    discount: compiledPage.frontmatter.discount ?? 0,
    imageUrl: compiledPage.frontmatter.imageUrl ?? '',
    state: compiledPage.frontmatter.state ?? 'none'
  }
  } catch (error) {
    console.error(`🛑 Page downloadMdx -> compileMdxPages error  ${slug}`)
    return null
  }
}
