import db from '~/utils/db.server'
import { getQueue } from '~/utils/p-queue.server'

export async function getMdxCount(contentDirectory: string) {
  const count = await db.content.aggregate({
    _count: { _all: true },
    where: { published: true, contentDirectory },
  })

  return count._count._all
}

export async function requiresUpdate(contentDirectory: string) {
  const requiresUpdateCount = await db.content.aggregate({
    _count: { requiresUpdate: true },
    where: { published: true, contentDirectory },
  })

  if (requiresUpdateCount._count.requiresUpdate === 0) {
    return null
  }

  const requiresUpdate = await db.content.findMany({
    where: { requiresUpdate: true },
  })

  return requiresUpdate
}


export async function getContentList(contentDirectory = 'item') {
  const contents = await db.content.findMany({
    where: { published: true, contentDirectory },
    select: {
      slug: true,
      title: true,
      timestamp: true,
      description: true,
      frontmatter: true,
      price: true,
      discount: true,
      imageUrl: true,
      state: true
    },
    orderBy: { timestamp: 'desc' },
  })

  return contents
}

export async function getContent(slug: string) {
  const rows = await db.content.findMany({
    where: { slug, published: true },
    select: {
      code: true,
      contentDirectory: true,
      frontmatter: true,
      slug: true,
      timestamp: true,
      title: true,
      requiresUpdate: true,
      description: true,
      price: true,
      discount: true,
      imageUrl: true,
      state: true
    },
  })

  if (!rows || rows.length === 0) {
    return null
  }

  if (rows.length > 1) {
    throw new Error(`Something is very wrong for the slug ${slug}`)
  }

  const content = rows[0]

  return {
    ...content,
    frontmatter: JSON.parse(content.frontmatter) as Record<string, unknown>,
  }
}

async function setRequiresUpdateImpl({
  slug,
  contentDirectory,
}: {
  slug: string
  contentDirectory: string
}) {
  await db.content.upsert({
    where: { slug },
    create: {
      requiresUpdate: true,
      slug,
      code: '',
      contentDirectory,
      frontmatter: '',
      published: true,
      title: '',  
      price: 0,
      discount: 0,
      imageUrl: ''
    },
    update: {
      requiresUpdate: true,
    },
  })
}

export async function setRequiresUpdate(
  ...params: Parameters<typeof setRequiresUpdateImpl>
) {
  const queue = await getQueue()
  const result = await queue.add(() => setRequiresUpdateImpl(...params))
  return result
}

async function upsertContentImpl({
  contentDirectory,
  slug,
  title,
  code,
  published,
  frontmatter,
  timestamp,
  description,
  price,
  discount,
  imageUrl,
  state
}: {
  contentDirectory: string
  slug: string
  title: string
  code: string
  published: boolean
  frontmatter: Record<string, unknown>
  timestamp: Date
  description: string
  price: number
  discount: number
  imageUrl: string
  state: string

}) {
  await db.content.upsert({
    where: { slug },
    update: {
      code,
      frontmatter: JSON.stringify(frontmatter),
      published,
      title,
      requiresUpdate: false,
      description,
      price,
      discount,
      imageUrl,
      state
    },
    create: {
      contentDirectory,
      code,
      frontmatter: JSON.stringify(frontmatter),
      published,
      slug,
      title,
      timestamp,
      description,
      price,
      discount,
      imageUrl,
      state
    },
  })
}


async function createdContentImpl({
  contentDirectory,
  slug,
  title,
  code,
  published,
  description,
  price,
  discount,
  imageUrl,
  state
}: {
  contentDirectory: string
  slug: string
  title: string
  code: string
  published: boolean
  description: string
  price: number
  discount: number
  imageUrl: string
  state: string

}) {
  await db.content.create({
     data: {
      contentDirectory,
      code,
      frontmatter: '',
      published,
      slug,
      title,
      timestamp: new Date(),
      description,
      price,
      discount,
      imageUrl,
      state
     }
  })
}

export async function deleteSlug(slug: string) {
  await db.content.delete({where: { slug: slug } })
}

export async function refreshAllContent() {
  return db.content.updateMany({ data: { requiresUpdate: true } })
}

export async function upsertContent(
  ...params: Parameters<typeof upsertContentImpl>
) {

  console.log(`🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳 🏄 🐳  ${JSON.stringify(params)} _____params_____`)
  const queue = await getQueue()

  const result = await queue.add(() => upsertContentImpl(...params))

  return result
}

export async function deleteContent(slug: string) {
  const queue = await getQueue()

  const result = await queue.add(() => deleteSlug(slug))

  return result
}

export async function createdContent(...params: Parameters<typeof createdContentImpl>) {
  const queue = await getQueue()

  const result = await queue.add(() => createdContentImpl(...params))

  return result
}


