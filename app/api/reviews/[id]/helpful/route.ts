import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // First, get the current helpful count
    const { data: currentReview, error: fetchError } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single()

    if (fetchError) {
      console.error('Error fetching current review:', fetchError)
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Increment the helpful count
    const newCount = (currentReview.helpful_count || 0) + 1

    // Update the review with the new count
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        helpful_count: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select('helpful_count')
      .single()

    if (error) {
      console.error('Error updating helpful count:', error)
      return NextResponse.json(
        { error: 'Failed to update helpful count' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      helpful_count: data.helpful_count
    })

  } catch (error) {
    console.error('Error in helpful endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}