import { supabase } from './supabase'

export interface PendingListingData {
  // Basic Information
  escape_room_name: string
  business_name?: string
  website?: string
  description: string
  
  // Location Information
  street_address: string
  city: string
  state: string
  zip_code: string
  country?: string
  
  // Game Details
  duration_minutes: number
  min_players: number
  max_players: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  price_per_person: number
  themes: string[]
  
  // Contact Information
  phone_number: string
  email: string
  
  // Images
  images: string[]
}

export interface PendingListing extends PendingListingData {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  submitted_by: string
  approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  approved_by?: string
}

export async function submitPendingListing(data: PendingListingData): Promise<{ success: boolean; error?: string; listingId?: string }> {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return { success: false, error: 'Session error: ' + sessionError.message }
    }
    
    if (!session) {
      console.log('No session found, user must be logged in')
      return { success: false, error: 'You must be logged in to submit a listing' }
    }

    console.log('Session found:', session.user.id)
    console.log('User email:', session.user.email)
    console.log('Data to insert:', data)

                const { data: listing, error } = await supabase
                  .from('pending_listings')
                  .insert({
                    escape_room_name: data.escape_room_name,
                    business_name: data.business_name,
                    website: data.website,
                    description: data.description,
                    street_address: data.street_address,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zip_code,
                    duration_minutes: data.duration_minutes,
                    min_players: data.min_players,
                    max_players: data.max_players,
                    difficulty_level: data.difficulty_level,
                    price_per_person: data.price_per_person,
                    themes: data.themes,
                    phone_number: data.phone_number,
                    email: data.email,
                    images: data.images,
                    submitted_by: session.user.id,
                    status: 'pending'
                  })
      .select('id')
      .single()

    if (error) {
      console.error('Error submitting listing:', error)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      return { success: false, error: error.message }
    }

    console.log('Listing submitted successfully:', listing)
    return { success: true, listingId: listing.id }
  } catch (error) {
    console.error('Error submitting listing:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getPendingListings(): Promise<{ success: boolean; listings?: PendingListing[]; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'You must be logged in to view listings' }
    }

    const { data: listings, error } = await supabase
      .from('pending_listings')
      .select('*')
      .eq('submitted_by', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching listings:', error)
      return { success: false, error: error.message }
    }

    return { success: true, listings: listings || [] }
  } catch (error) {
    console.error('Error fetching listings:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getAllPendingListings(): Promise<{ success: boolean; listings?: PendingListing[]; error?: string }> {
  try {
    const { data: listings, error } = await supabase
      .from('pending_listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all listings:', error)
      return { success: false, error: error.message }
    }

    return { success: true, listings: listings || [] }
  } catch (error) {
    console.error('Error fetching all listings:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function approveListing(listingId: string): Promise<{ success: boolean; error?: string; roomId?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const { data, error } = await supabase.rpc('approve_pending_listing', {
      listing_id: listingId,
      approver_id: user.id
    })

    if (error) {
      console.error('Error approving listing:', error)
      return { success: false, error: error.message }
    }

    return data
  } catch (error) {
    console.error('Error approving listing:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function rejectListing(listingId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const { data, error } = await supabase.rpc('reject_pending_listing', {
      listing_id: listingId,
      approver_id: user.id,
      reason: reason || null
    })

    if (error) {
      console.error('Error rejecting listing:', error)
      return { success: false, error: error.message }
    }

    return data
  } catch (error) {
    console.error('Error rejecting listing:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getPendingListingById(id: string): Promise<{ success: boolean; listing?: PendingListing; error?: string }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return { success: false, error: 'Session error: ' + sessionError.message }
    }
    
    if (!session) {
      console.log('No session found, user must be logged in')
      return { success: false, error: 'You must be logged in to view listings' }
    }

    const { data: listing, error } = await supabase
      .from('pending_listings')
      .select('*')
      .eq('id', id)
      .eq('submitted_by', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching listing:', error)
      return { success: false, error: error.message }
    }

    return { success: true, listing }
  } catch (error) {
    console.error('Error fetching listing:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updatePendingListing(id: string, data: PendingListingData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return { success: false, error: 'Session error: ' + sessionError.message }
    }
    
    if (!session) {
      console.log('No session found, user must be logged in')
      return { success: false, error: 'You must be logged in to update listings' }
    }

    const { error } = await supabase
      .from('pending_listings')
      .update({
        escape_room_name: data.escape_room_name,
        business_name: data.business_name,
        website: data.website,
        description: data.description,
        street_address: data.street_address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        duration_minutes: data.duration_minutes,
        min_players: data.min_players,
        max_players: data.max_players,
        difficulty_level: data.difficulty_level,
        price_per_person: data.price_per_person,
        themes: data.themes,
        phone_number: data.phone_number,
        email: data.email,
        images: data.images,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('submitted_by', session.user.id)

    if (error) {
      console.error('Error updating listing:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating listing:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
