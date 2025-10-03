'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import Auth from '@/components/auth/Auth'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="Escape room authentication"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        {/* Atmospheric elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-escape-red" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpeg"
          alt="Escape room authentication"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      {/* Enhanced atmospheric elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Enhanced floating mystery elements */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-1/4 left-1/6 text-6xl animate-mystery-float pointer-events-none drop-shadow-2xl">🔐</div>
        <div className="absolute top-3/4 right-1/5 text-5xl animate-mystery-float delay-1000 pointer-events-none drop-shadow-2xl">🔑</div>
        <div className="absolute top-1/2 right-1/4 text-4xl animate-mystery-float delay-500 pointer-events-none drop-shadow-2xl">👤</div>
        <div className="absolute bottom-1/4 left-1/4 text-5xl animate-mystery-float delay-1500 pointer-events-none drop-shadow-2xl">🎯</div>
        <div className="absolute top-1/3 right-1/6 text-3xl animate-mystery-float delay-2000 pointer-events-none drop-shadow-2xl">✨</div>
        <div className="absolute bottom-1/3 left-1/5 text-4xl animate-mystery-float delay-2500 pointer-events-none drop-shadow-2xl">🚀</div>
      </div>

      {/* Additional geometric background elements */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/30 rounded-full animate-spin-slow delay-1500"></div>
      </div>

      {/* Glowing accent lines */}
      <div className="absolute inset-0 opacity-15 -z-10">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/50 to-transparent"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/50 to-transparent"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/50 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/50 to-transparent"></div>
      </div>
      
      {/* Glowing particles effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500"></div>
      </div>
      
      <div className="w-full max-w-lg relative z-10">
        <Auth />
      </div>
    </div>
  )
}