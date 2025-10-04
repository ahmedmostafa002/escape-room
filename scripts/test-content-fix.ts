import { supabase } from '../lib/supabase'
import { fixMojibake, hasMojibake } from './fix-content-encoding'

// Test function to check a specific listing
async function testListingContent(listingId: string) {
  try {
    console.log(`🔍 Testing listing: ${listingId}`)
    
    const { data: listing, error } = await supabase
      .from('escape_rooms')
      .select('id, name, description, post_content')
      .eq('id', listingId)
      .single()

    if (error) {
      console.error('❌ Error fetching listing:', error)
      return
    }

    if (!listing) {
      console.log('❌ Listing not found')
      return
    }

    console.log(`\n📝 Listing: ${listing.name}`)
    console.log(`🆔 ID: ${listing.id}`)

    // Check description
    if (listing.description) {
      console.log('\n📄 Description:')
      console.log('Before:', listing.description.substring(0, 200) + '...')
      
      if (hasMojibake(listing.description)) {
        console.log('⚠️  Contains mojibake!')
        const fixed = fixMojibake(listing.description)
        console.log('After:', fixed.substring(0, 200) + '...')
      } else {
        console.log('✅ No mojibake found')
      }
    }

    // Check post_content
    if (listing.post_content) {
      console.log('\n📄 Post Content:')
      console.log('Before:', listing.post_content.substring(0, 200) + '...')
      
      if (hasMojibake(listing.post_content)) {
        console.log('⚠️  Contains mojibake!')
        const fixed = fixMojibake(listing.post_content)
        console.log('After:', fixed.substring(0, 200) + '...')
      } else {
        console.log('✅ No mojibake found')
      }
    }

  } catch (error) {
    console.error('❌ Error testing listing:', error)
  }
}

// Test function to find a listing with mojibake
async function findTestListing() {
  try {
    console.log('🔍 Finding a listing with mojibake...')
    
    const { data: listings, error } = await supabase
      .from('escape_rooms')
      .select('id, name, description, post_content')
      .not('description', 'is', null)
      .limit(10)

    if (error) {
      console.error('❌ Error fetching listings:', error)
      return
    }

    for (const listing of listings || []) {
      if ((listing.description && hasMojibake(listing.description)) ||
          (listing.post_content && hasMojibake(listing.post_content))) {
        console.log(`\n🎯 Found listing with mojibake: ${listing.name}`)
        await testListingContent(listing.id)
        return
      }
    }

    console.log('✅ No listings with mojibake found in sample')

  } catch (error) {
    console.error('❌ Error finding test listing:', error)
  }
}

// Run the test
if (require.main === module) {
  const listingId = process.argv[2]
  
  if (listingId) {
    testListingContent(listingId)
  } else {
    findTestListing()
  }
}
