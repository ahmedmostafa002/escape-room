"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import EscapeRoomCard from "@/components/escape-room-card"
import Link from "next/link"

interface EscapeRoomGridProps {
  rooms?: any[]
  loading?: boolean
  currentPage?: number
  totalCount?: number
  roomsPerPage?: number
  onPageChange?: (page: number) => void
  showPagination?: boolean
}

export default function EscapeRoomGrid({ 
  rooms = [], 
  loading = false, 
  currentPage = 1, 
  totalCount = 0, 
  roomsPerPage = 20, 
  onPageChange, 
  showPagination = false 
}: EscapeRoomGridProps) {
  const searchParams = useSearchParams()
  const themeFromUrl = searchParams.get('theme') ? decodeURIComponent(searchParams.get('theme')!) : 'all'
  const searchFromUrl = searchParams.get('search') || ''
  const locationFromUrl = searchParams.get('location') || ''
  
  // Combine search and location into a single search term
  const initialSearchTerm = [searchFromUrl, locationFromUrl].filter(Boolean).join(', ')
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedTheme, setSelectedTheme] = useState(themeFromUrl)

  // Update selectedTheme and searchTerm when URL parameters change
  useEffect(() => {
    setSelectedTheme(themeFromUrl)
    const newSearchTerm = [searchFromUrl, locationFromUrl].filter(Boolean).join(', ')
    setSearchTerm(newSearchTerm)
  }, [themeFromUrl, searchFromUrl, locationFromUrl])

  // Use rooms directly since filtering is now handled by the backend
  const filteredRooms = rooms
  const totalPages = Math.ceil(totalCount / roomsPerPage)

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">All Escape Rooms</h2>
          <div className="text-sm text-gray-600">Loading...</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="bg-gray-300 h-48 w-full"></div>
              <CardHeader className="pb-2">
                <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-300 h-4 w-full rounded mb-2"></div>
                <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Discover All Escape Rooms</h2>
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * roomsPerPage) + 1}-{Math.min(currentPage * roomsPerPage, totalCount)} of {totalCount.toLocaleString()} rooms
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredRooms.map((room) => (
          <EscapeRoomCard key={room.id} room={room} />
        ))}
      </div>

      {/* Pagination or Browse More Button */}
      {showPagination ? (
        <div className="flex flex-col items-center mt-8 space-y-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * roomsPerPage) + 1}-{Math.min(currentPage * roomsPerPage, totalCount)} of {totalCount} rooms
          </div>
          
          {/* Pagination Controls */}
          {totalCount > roomsPerPage && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) onPageChange?.(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(totalCount / roomsPerPage)) }, (_, i) => {
                  const totalPages = Math.ceil(totalCount / roomsPerPage)
                  let pageNum
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange?.(pageNum)
                        }}
                        isActive={currentPage === pageNum}
                        className={currentPage === pageNum ? "bg-escape-red hover:bg-escape-red-600 text-white" : "cursor-pointer"}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < Math.ceil(totalCount / roomsPerPage)) onPageChange?.(currentPage + 1)
                    }}
                    className={currentPage >= Math.ceil(totalCount / roomsPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <Link href="/browse">
            <Button 
              size="lg" 
              className="px-8 py-3 bg-escape-red hover:bg-escape-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Browse All Escape Rooms
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}
