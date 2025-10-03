'use client'

import dynamic from 'next/dynamic'
import { ComponentType, ReactElement } from 'react'

// Dynamic imports with loading states for better code splitting
export const DynamicTestimonialsSection = dynamic(
  () => import('@/components/testimonials-section'),
  {
    loading: () => (
      <div className="h-96 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading testimonials...</div>
      </div>
    ),
    ssr: false // This component is not critical for SEO
  }
)

export const DynamicBlogSection = dynamic(
  () => import('@/components/blog-section'),
  {
    loading: () => (
      <div className="h-96 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading blog posts...</div>
      </div>
    ),
    ssr: true // Keep SSR for SEO benefits
  }
)

export const DynamicNewsletterSection = dynamic(
  () => import('@/components/newsletter-section'),
  {
    loading: () => (
      <div className="h-64 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading newsletter...</div>
      </div>
    ),
    ssr: false
  }
)

export const DynamicCTASection = dynamic(
  () => import('@/components/cta-section'),
  {
    loading: () => (
      <div className="h-32 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    ),
    ssr: false
  }
)

// Dynamic import for blog sidebar (used in blog pages)
export const DynamicBlogSidebar = dynamic(
  () => import('@/components/blog-sidebar'),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-32 bg-gray-50 animate-pulse rounded-lg" />
        <div className="h-48 bg-gray-50 animate-pulse rounded-lg" />
        <div className="h-32 bg-gray-50 animate-pulse rounded-lg" />
      </div>
    ),
    ssr: true // Keep SSR for SEO
  }
)

// Dynamic import for search filters (used in browse page)
export const DynamicSearchFilters = dynamic(
  () => import('@/components/search-filters'),
  {
    loading: () => (
      <div className="h-64 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading filters...</div>
      </div>
    ),
    ssr: false // Filters are interactive, no need for SSR
  }
)

// Higher-order component for creating dynamic imports with custom loading states
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: () => ReactElement
    ssr?: boolean
    fallbackHeight?: string
  } = {}
) {
  const { loading, ssr = true, fallbackHeight = 'h-32' } = options
  
  const defaultLoading = () => (
    <div className={`${fallbackHeight} bg-gray-50 animate-pulse rounded-lg flex items-center justify-center`}>
      <div className="text-gray-500">Loading...</div>
    </div>
  )
  
  return dynamic(importFn, {
    loading: loading || defaultLoading,
    ssr
  })
}

// Utility for preloading components
export function preloadComponent(importFn: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Preload on user interaction or after initial load
    const preload = () => {
      importFn().catch(() => {
        // Silently handle preload errors
      })
    }
    
    // Preload on mouse enter or focus events
    return {
      onMouseEnter: preload,
      onFocus: preload
    }
  }
  return {}
}