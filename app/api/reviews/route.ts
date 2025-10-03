import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('room_id')

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    // Fetch original room data (rating and review count)
    const { data: roomData, error: roomError } = await supabase
      .from('escape_rooms')
      .select('rating, reviews_average')
      .eq('id', roomId)
      .single()

    if (roomError) {
      console.error('Error fetching room data:', roomError)
      return NextResponse.json(
        { error: 'Failed to fetch room data' },
        { status: 500 }
      )
    }

    // Fetch manual reviews for the room
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    // Use original room data as base, with manual reviews as additions
    const originalRating = roomData?.rating ? parseFloat(roomData.rating.toString()) : 0
    const originalReviewCount = roomData?.reviews_average || 0
    const manualReviewCount = reviews.length

    // Calculate combined statistics
    const stats = {
      total: originalReviewCount + manualReviewCount,
      average: originalRating || 0, // Always use original rating, default to 0 if null
      distribution: [0, 0, 0, 0, 0], // 1-star to 5-star counts
      originalRating: originalRating || 0, // Default to 0 if null
      originalReviewCount,
      manualReviewCount
    }

    // Calculate rating distribution for manual reviews only
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        stats.distribution[review.rating - 1]++
      }
    })

    return NextResponse.json({
      reviews,
      stats
    })
  } catch (error) {
    console.error('Error in GET /api/reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      room_id,
      user_name,
      user_email,
      rating,
      title,
      comment,
      visit_date
    } = body

    // Validate required fields
    if (!room_id || !user_name || !rating) {
      return NextResponse.json(
        { error: 'Room ID, user name, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify that the room exists
    const { data: room, error: roomError } = await supabase
      .from('escape_rooms')
      .select('id')
      .eq('id', room_id)
      .single()

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Insert the review with is_manual flag to distinguish user-added reviews
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        room_id,
        user_name: user_name.trim(),
        user_email: user_email?.trim() || null,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        visit_date: visit_date || null,
        helpful_count: 0,
        is_verified: false, // Could be updated later based on verification logic
        is_manual: true // Flag to identify manually added reviews
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting review:', insertError)
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Review created successfully',
      review
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('review_id')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // First, check if the review exists and is manually added
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('id, is_manual')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of manually added reviews
    if (!review.is_manual) {
      return NextResponse.json(
        { error: 'Cannot delete original database reviews' },
        { status: 403 }
      )
    }

    // Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (deleteError) {
      console.error('Error deleting review:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}