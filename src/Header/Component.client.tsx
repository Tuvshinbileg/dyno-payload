'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="border-b bg-background" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="hover:bg-accent transition-colors rounded-md" />
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Logo loading="eager" priority="high" className="invert dark:invert-0" />
            </Link>
          </div>
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
