import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: 'Auth error',
        details: authError.message
      })
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found',
        message: 'User must be logged in'
      })
    }

    // Test database connection
    const { data: testData, error: dbError } = await supabase
      .from('pending_listings')
      .select('count')
      .limit(1)

    if (dbError) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: dbError.message
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      database: 'Connected',
      message: 'Authentication and database working'
    })
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
