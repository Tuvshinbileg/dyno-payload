import type { ExampleBlock as ExampleBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
  disableInnerContainer?: boolean
} & ExampleBlockProps

export const ExampleBlock: React.FC<Props> = ({
  className,
  title,
  description,
  content,
  backgroundColor = 'light',
  alignment = 'left',
  disableInnerContainer,
}) => {
  const bgColorClasses = {
    light: 'bg-slate-50',
    dark: 'bg-slate-900 text-white',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      className={cn(
        'w-full py-12 px-6 md:px-8',
        bgColorClasses[backgroundColor as keyof typeof bgColorClasses] || bgColorClasses.light,
        className
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-4xl',
          alignmentClasses[alignment as keyof typeof alignmentClasses] || alignmentClasses.left
        )}
      >
        {title && (
          <h2 className={cn('text-3xl font-bold mb-2', backgroundColor === 'dark' && 'text-white')}>
            {title}
          </h2>
        )}

        {description && (
          <p
            className={cn(
              'text-lg mb-6 opacity-80',
              backgroundColor === 'dark' && 'text-gray-200'
            )}
          >
            {description}
          </p>
        )}

        {content && (
          <div className={cn('prose max-w-none', backgroundColor === 'dark' && 'prose-invert')}>
            <RichText data={content} enableGutter={false} />
          </div>
        )}
      </div>
    </div>
  )
}
