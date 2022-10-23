import { initSeo } from 'remix-seo'

export const { getSeo, getSeoLinks, getSeoMeta } = initSeo({
  title: 'Boss cafe HCM - iMarscoffee.com',
  description: 'Boss cafe HCM - iMarscoffee.com',
  twitter: {
    card: 'summary',
    creator: '@handle',
    site: 'https://imarscoffee.com',
    title: 'Boss cafe HCM - iMarscoffee.com',
    description: 'Boss cafe HCM - iMarscoffee.com',
  },
})
