import * as React from 'react'
import type { NavLinkProps } from '@remix-run/react'
import { NavLink as RemixNavLink } from '@remix-run/react'
import clsx from 'clsx'

export default function NavLink({ className, ...rest }: NavLinkProps) {
  return (
    <RemixNavLink
      className={({ isActive }) =>
        clsx(
          'text-black dark:text-white',
          className,
        )
      }
      {...rest}
    />
  )
}
