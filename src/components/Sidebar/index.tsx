import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SidebarClient } from './Sidebar.client'

export const Sidebar = async () => {
  const payload = await getPayload({ config: configPromise })

  // Fetch all published pages
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      title: true,
      slug: true,
      id: true,
    },
    sort: 'title',
  })

  return <SidebarClient pages={pages.docs} />
}
