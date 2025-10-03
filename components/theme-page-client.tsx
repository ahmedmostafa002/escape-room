'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EscapeRoomCard from '@/components/escape-room-card'

interface ThemePageClientProps {
  rooms: any[]
  roomsPerPage: number
  themeName: string
}

export default function ThemePageClient({ rooms, roomsPerPage, themeName }: ThemePageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(rooms.length / roomsPerPage)
  const startIndex = (currentPage - 1) * roomsPerPage
  const endIndex = startIndex + roomsPerPage
  const paginatedRooms = rooms.slice(startIndex, endIndex)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {rooms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {paginatedRooms.map((room, index) => (
                <EscapeRoomCard key={index} room={room} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? "bg-[#00d4aa] hover:bg-[#1dd1a1]" : ""}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No rooms found</h3>
            <p className="text-gray-600 mb-8">We couldn&apos;t find any escape rooms for this theme.</p>
            <Link href="/themes">
              <Button className="bg-[#00d4aa] hover:bg-[#1dd1a1] text-white">
                Browse All Themes
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}