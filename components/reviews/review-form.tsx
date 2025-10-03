'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface ReviewFormProps {
  roomId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ roomId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    title: '',
    comment: '',
    visit_date: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive'
      })
      return
    }

    if (!formData.user_name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_id: roomId,
          rating,
          ...formData
        })
      })

      if (response.ok) {
        toast({
          title: 'Review Submitted',
          description: 'Thank you for your review! It will be visible shortly.'
        })
        
        // Reset form
        setRating(0)
        setFormData({
          user_name: '',
          user_email: '',
          title: '',
          comment: '',
          visit_date: ''
        })
        
        onReviewSubmitted?.()
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              starValue <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      )
    })
  }

  return (
    <Card className="border border-slate-200 bg-slate-50/80">
      <CardHeader className="bg-white/90 border-b border-slate-200">
        <CardTitle className="text-slate-800 flex items-center gap-2">
          <Send className="h-5 w-5 text-slate-600" />
          Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-slate-700 font-medium">Your Rating *</Label>
            <div className="flex items-center gap-1 mt-2">
              {renderStars()}
              {rating > 0 && (
                <span className="ml-2 text-sm text-slate-600">
                  {rating}/5 stars
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="user_name" className="text-slate-700 font-medium">
              Your Name *
            </Label>
            <Input
              id="user_name"
              value={formData.user_name}
              onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
              placeholder="Enter your name"
              className="mt-1"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="user_email" className="text-slate-700 font-medium">
              Email (Optional)
            </Label>
            <Input
              id="user_email"
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
              placeholder="your.email@escaperoomsfinder.com"
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Email won&apos;t be displayed publicly
            </p>
          </div>

          {/* Visit Date */}
          <div>
            <Label htmlFor="visit_date" className="text-slate-700 font-medium">
              Visit Date (Optional)
            </Label>
            <Input
              id="visit_date"
              type="date"
              value={formData.visit_date}
              onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-slate-700 font-medium">
              Review Title (Optional)
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              className="mt-1"
              maxLength={200}
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-slate-700 font-medium">
              Your Review (Optional)
            </Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with this escape room..."
              className="mt-1 min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.comment.length}/1000 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}