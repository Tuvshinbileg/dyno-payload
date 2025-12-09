'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Home, Sparkles, ChevronRight, Layers } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { cn } from '@/utilities/ui'

interface SidebarPage {
  id: string
  title: string
  slug: string
}

interface SidebarClientProps {
  pages: SidebarPage[]
}

export const SidebarClient: React.FC<SidebarClientProps> = ({ pages }) => {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" className="border-r shadow-sm bg-background">
      <SidebarHeader className="border-b bg-background/95 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/95 h-16">
        <div className="px-4 py-bg-gradient-to-b from-muted/50 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Layers className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Dyno</span>
              <span className="text-xs text-muted-foreground">Payload CMS</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-background">
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {pages.map((page) => {
                const href = page.slug === 'home' ? '/' : `/${page.slug}`
                const isActive = pathname === href
                const isHome = page.slug === 'home'

                return (
                  <SidebarMenuItem key={page.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={cn(
                        "relative group/item transition-all duration-200 bg-transparent",
                        "hover:bg-accent",
                        isActive && "bg-accent font-medium shadow-sm"
                      )}
                    >
                      <Link href={href} className="flex items-center gap-3 py-2.5">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                          isActive ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground group-hover/item:bg-accent group-hover/item:text-foreground"
                        )}>
                          {isHome ? (
                            <Home className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <span className="flex-1 truncate">{page.title}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 text-primary" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4 mt-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No pages yet</h3>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Create your first page in the Payload admin to get started
            </p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 sticky bottom-0 z-10">
        <div className="px-4 py-3 bg-gradient-to-t from-muted/30 to-transparent">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
              <Layers className="h-3 w-3 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground text-xs">Payload CMS</span>
              <span className="text-[10px]">v3.0</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
