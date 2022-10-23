import { getSeo } from "~/utils/seo";
import type {
    ActionFunction,
    HeadersFunction,
    LinksFunction,
    LoaderFunction,
    MetaFunction,
  } from '@remix-run/server-runtime'
  
const [seoMeta, seoLinks] = getSeo({
    title: 'Robusta, Arabica, Culi',
    description: 'Robusta, Arabica, Culi',
    twitter: {
      title: 'Robusta, Arabica, Culi',
      description: 'Robusta, Arabica, Culi',
    },
  })
  
  export const meta: MetaFunction = () => {
    return { ...seoMeta }
  }
  
  export const links: LinksFunction = () => {
    return [...seoLinks]
  }
  
const Products = () => {
    return ( <>Products</> );
}
 
export default Products;