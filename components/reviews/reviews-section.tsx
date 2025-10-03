'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, TrendingUp, Users, Clock, Trophy, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ReviewCard } from './review-card'
import { ReviewForm } from './review-form'

interface Review {
  id: string
  user_name: string
  rating: number
  title?: string
  comment?: string
  visit_date?: string
  helpful_count: number
  created_at: string
  is_verified: boolean
  is_manual?: boolean
}

interface ReviewsSectionProps {
  roomId: string
  initialReviews?: Review[]
  averageRating?: number
  totalReviews?: number
}

export function ReviewsSection({ 
  roomId, 
  initialReviews = [], 
  averageRating = 0, 
  totalReviews = 0 
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    average: averageRating,
    total: totalReviews,
    distribution: [0, 0, 0, 0, 0], // 1-star to 5-star counts
    originalRating: 0,
    originalReviewCount: 0,
    manualReviewCount: 0
  })

  useEffect(() => {
    fetchReviews()
  }, [roomId])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews?room_id=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        // Ensure we keep original rating even when all manual reviews are deleted
        setStats({
          ...data.stats,
          average: data.stats.originalRating || 0,
          total: (data.stats.originalReviewCount || 0) + (data.stats.manualReviewCount || 0)
        })
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewSubmitted = () => {
    setShowForm(false)
    fetchReviews() // Refresh reviews after submission
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('reviewUpdated'))
  }

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      })
      if (response.ok) {
        // Update the helpful count locally
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: review.helpful_count + 1 }
            : review
        ))
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('reviewUpdated'))
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error)
    }
  }

  const renderStars = (rating: number, size = 'h-4 w-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderRatingDistribution = () => {
    const maxCount = Math.max(...stats.distribution)
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = stats.distribution[stars - 1] || 0
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
          
          return (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-slate-600">{stars}★</span>
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-slate-600 text-xs">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card className="border-2 border-escape-red/20 bg-gradient-to-br from-slate-900/5 via-white to-escape-red/5 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
        {/* Atmospheric background elements */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-6 right-6 w-20 h-20 bg-escape-red rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-6 left-6 w-16 h-16 bg-orange-400 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-800/10 rounded-full blur-3xl" />
        </div>
        
        <CardHeader className="bg-gradient-to-r from-slate-900/10 via-transparent to-escape-red/10 border-b border-escape-red/20 relative z-10">
          <CardTitle className="text-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-full bg-escape-red/20 group-hover:bg-escape-red/30 transition-colors">
              <Trophy className="h-5 w-5 text-escape-red" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-bold">
              Escape Room Reviews & Ratings
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-escape-red/5 to-slate-900/5 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-escape-red/20">
                <div className="text-5xl font-bold bg-gradient-to-br from-escape-red to-slate-800 bg-clip-text text-transparent mb-3">
                  {stats.average.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {renderStars(stats.average, 'h-6 w-6')}
                </div>
                <p className="text-slate-600 font-medium">
                  Based on {stats.total} adventurer review{stats.total !== 1 ? 's' : ''}
                  {stats.originalReviewCount > 0 && stats.manualReviewCount > 0 && (
                    <span className="block text-sm text-slate-500 mt-2">
                      ({stats.originalReviewCount} verified + {stats.manualReviewCount} user review{stats.manualReviewCount !== 1 ? 's' : ''})
                    </span>
                  )}
                  {stats.originalReviewCount > 0 && stats.manualReviewCount === 0 && (
                    <span className="block text-sm text-slate-500 mt-2">
                      (Verified escape room reviews)
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-escape-red/5 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-escape-red" />
                  Experience Breakdown
                </h4>
                {renderRatingDistribution()}
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gradient-to-r from-transparent via-escape-red/30 to-transparent" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-escape-red to-escape-red-600 text-white border-0 shadow-lg">
                <Users className="h-3 w-3 mr-1" />
                {stats.total} Total Adventures
              </Badge>
              {stats.manualReviewCount > 0 && (
                <Badge variant="outline" className="border-escape-red/30 text-escape-red bg-escape-red/5">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {stats.manualReviewCount} User Review{stats.manualReviewCount !== 1 ? 's' : ''}
                </Badge>
              )}
              <Badge variant="outline" className="border-slate-300 text-slate-600 bg-slate-50">
                <Clock className="h-3 w-3 mr-1" />
                Recent Activity
              </Badge>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-escape-red to-escape-red-600 hover:from-escape-red-600 hover:to-escape-red text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {showForm ? 'Cancel Review' : 'Share Your Adventure'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <ReviewForm 
          roomId={roomId} 
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-escape-red/20">
              <MessageSquare className="h-5 w-5 text-escape-red" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Adventurer Stories ({reviews.length})
            </h3>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
              />
            ))}
          </div>
        </div>
      ) : (
        !isLoading && (
          <Card className="border-2 border-dashed border-escape-red/30 bg-gradient-to-br from-escape-red/5 via-white to-slate-50/80 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
            {/* Atmospheric background */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="absolute top-4 right-4 w-16 h-16 bg-escape-red rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-400 rounded-full blur-lg animate-pulse delay-1000" />
            </div>
            
            <CardContent className="pt-12 pb-12 text-center relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-escape-red/10 to-slate-900/10 rounded-full blur-2xl" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-escape-red/20">
                  <Trophy className="h-12 w-12 text-escape-red mx-auto" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                No Adventure Stories Yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                 {stats.originalReviewCount > 0 ? (
                   <>The rating above is based on {stats.originalReviewCount} verified reviews. Be the first to share your escape room adventure!</>
                 ) : (
                   <>Be the first brave adventurer to share your escape room experience and help future puzzle solvers!</>
                 )}
               </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-escape-red to-escape-red-600 hover:from-escape-red-600 hover:to-escape-red text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Share Your Adventure
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}