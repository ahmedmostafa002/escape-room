'use client'

import { useEffect, useState } from 'react'
import { PageLoadingSkeleton } from './loading-skeleton'

export default function GlobalLoading() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Show loading for minimum 1 second to prevent flash
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!showLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <PageLoadingSkeleton />
    </div>
  )
}
