import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const reviewId = params.id

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Check if the review exists
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('id, helpful_count')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Increment the helpful count
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({ 
        helpful_count: review.helpful_count + 1 
      })
      .eq('id', reviewId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating helpful count:', updateError)
      return NextResponse.json(
        { error: 'Failed to update helpful count' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Review marked as helpful',
      review: updatedReview
    })
  } catch (error) {
    console.error('Error in POST /api/reviews/[id]/helpful:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}