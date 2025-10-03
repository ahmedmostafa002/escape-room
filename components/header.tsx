"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  // const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 0)
  //   }

  //   window.addEventListener('scroll', handleScroll)
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [])

  return (
    <header id="navigation" className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-md border-b border-escape-red/20 shadow-lg shadow-escape-red/10 relative overflow-hidden">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-24 h-24 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Mystery elements */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-2 left-10 text-lg animate-mystery-float pointer-events-none">🔑</div>
        <div className="absolute top-3 right-20 text-sm animate-mystery-float delay-500 pointer-events-none">🔍</div>
      </div>
      <div className="container py-4 md:py-6 relative z-10">
        <div className="flex items-center justify-between min-h-14 md:min-h-16">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center gap-3">
                <Image 
                  src="/images/escape-room-finder.png" 
                  alt="Escape Rooms Finder Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-12 object-contain transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-escape-red leading-tight tracking-wide drop-shadow-lg">ESCAPE ROOMS</span>
                  <span className="text-lg font-bold text-gray-200 leading-tight tracking-wider drop-shadow-md">FINDER</span>
                </div>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link href="/browse" className="text-gray-300 hover:text-escape-red transition-all duration-300 hover:scale-105 font-medium relative group">
                Browse Rooms
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-escape-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link href="/locations" className="text-gray-300 hover:text-escape-red transition-all duration-300 hover:scale-105 font-medium relative group">
                Escape Rooms By Country
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-escape-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-escape-red transition-all duration-300 hover:scale-105 font-medium relative group">
                Blog
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-escape-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-escape-red transition-all duration-300 hover:scale-105 font-medium relative group">
                Contact Us
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-escape-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            
            {/* User Authentication */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                      <AvatarFallback className="bg-escape-red text-white">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white shadow-xl shadow-escape-red/20 backdrop-blur-md" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal text-gray-200">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="text-gray-200 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white">
                    <Link href="/auth" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-800 focus:text-red-300 focus:bg-gray-800"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs md:text-sm">
                  <User className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
            
            {/* List Your Room Button - Hidden on small screens */}
            <Link href="/add-listing" className="hidden md:block">
              <Button size="sm">
                List Your Room
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-gray-300 hover:text-escape-red hover:bg-escape-red/10 p-2 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-escape-red/20 bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-md">
            <div className="container py-4">
              <nav className="flex flex-col gap-4">
                <Link href="/browse" className="text-gray-300 hover:text-escape-red transition-colors py-2 font-medium">
                  Browse Rooms
                </Link>
                <Link href="/locations" className="text-gray-300 hover:text-escape-red transition-colors py-2 font-medium">
                  Escape Rooms By Country
                </Link>
                <Link href="/about" className="text-gray-300 hover:text-escape-red transition-colors py-2 font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-escape-red transition-colors py-2 font-medium">
                  Contact
                </Link>
                <div className="pt-2 border-t border-escape-red/20">
                  <Link href="/add-listing">
                    <Button size="sm" className="w-full">
                      List Your Room
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
