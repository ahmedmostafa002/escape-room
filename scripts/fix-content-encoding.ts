import { supabase } from '../lib/supabase'

// Function to fix common mojibake patterns
function fixMojibake(text: string): string {
  if (!text || typeof text !== 'string') return text

  // Common mojibake patterns and their fixes
  const fixes = [
    // Common character fixes
    { pattern: /ÃÂ¢ÃÃÃÃO/g, replacement: 'Great Escape' },
    { pattern: /Ã ÂÇÃOÂ Ã ÂOs/g, replacement: 'Butch Cassidy' },
    { pattern: /Ã¢â‚¬â€œ/g, replacement: '–' },
    { pattern: /Ã¢â‚¬â€/g, replacement: '—' },
    { pattern: /Ã¢â‚¬Å"/g, replacement: '"' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '"' },
    { pattern: /Ã¢â‚¬â„¢/g, replacement: "'" },
    { pattern: /Ã¢â‚¬â€°/g, replacement: "'" },
    { pattern: /Ã¢â‚¬Â¦/g, replacement: '…' },
    { pattern: /Ã¢â‚¬Â¢/g, replacement: '•' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '–' },
    { pattern: /Ã¢â‚¬â€/g, replacement: '—' },
    { pattern: /Ã¢â‚¬Å"/g, replacement: '"' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '"' },
    { pattern: /Ã¢â‚¬â„¢/g, replacement: "'" },
    { pattern: /Ã¢â‚¬â€°/g, replacement: "'" },
    { pattern: /Ã¢â‚¬Â¦/g, replacement: '…' },
    { pattern: /Ã¢â‚¬Â¢/g, replacement: '•' },
    
    // Fix common words that get corrupted
    { pattern: /Ã¢â‚¬Å"([^"]*?)Ã¢â‚¬Â/g, replacement: '"$1"' },
    { pattern: /Ã¢â‚¬â„¢([^']*?)Ã¢â‚¬â€°/g, replacement: "'$1'" },
    
    // Fix bullet points
    { pattern: /Ã¢â‚¬Â¢/g, replacement: '•' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '•' },
    
    // Fix dashes and hyphens
    { pattern: /Ã¢â‚¬â€œ/g, replacement: '–' },
    { pattern: /Ã¢â‚¬â€/g, replacement: '—' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '–' },
    
    // Fix quotes
    { pattern: /Ã¢â‚¬Å"/g, replacement: '"' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '"' },
    { pattern: /Ã¢â‚¬â„¢/g, replacement: "'" },
    { pattern: /Ã¢â‚¬â€°/g, replacement: "'" },
    
    // Fix ellipsis
    { pattern: /Ã¢â‚¬Â¦/g, replacement: '…' },
    
    // Fix common escape room terms
    { pattern: /Ã¢â‚¬Å"Escape RoomÃ¢â‚¬Â/g, replacement: '"Escape Room"' },
    { pattern: /Ã¢â‚¬Å"AdventureÃ¢â‚¬Â/g, replacement: '"Adventure"' },
    { pattern: /Ã¢â‚¬Å"PuzzleÃ¢â‚¬Â/g, replacement: '"Puzzle"' },
    { pattern: /Ã¢â‚¬Å"MysteryÃ¢â‚¬Â/g, replacement: '"Mystery"' },
    
    // Clean up any remaining mojibake patterns
    { pattern: /Ã[^a-zA-Z0-9\s]/g, replacement: '' },
    { pattern: /â‚¬[^a-zA-Z0-9\s]/g, replacement: '' },
  ]

  let fixedText = text

  // Apply all fixes
  fixes.forEach(fix => {
    fixedText = fixedText.replace(fix.pattern, fix.replacement)
  })

  // Clean up any remaining mojibake
  fixedText = fixedText.replace(/Ã[^a-zA-Z0-9\s.,!?;:()\-]/g, '')
  fixedText = fixedText.replace(/â‚¬[^a-zA-Z0-9\s.,!?;:()\-]/g, '')

  return fixedText.trim()
}

// Function to check if text has mojibake
function hasMojibake(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  
  // Common mojibake patterns
  const mojibakePatterns = [
    /Ã[^a-zA-Z0-9\s.,!?;:()\-]/,
    /â‚¬[^a-zA-Z0-9\s.,!?;:()\-]/,
    /Ã¢â‚¬/,
    /ÃÂ/,
    /Ã /,
  ]
  
  return mojibakePatterns.some(pattern => pattern.test(text))
}

// Function to fix a single listing
async function fixListingContent(listingId: string) {
  try {
    // Get the listing
    const { data: listing, error: fetchError } = await supabase
      .from('escape_rooms')
      .select('id, name, description, post_content')
      .eq('id', listingId)
      .single()

    if (fetchError) {
      console.error(`Error fetching listing ${listingId}:`, fetchError)
      return false
    }

    if (!listing) {
      console.log(`Listing ${listingId} not found`)
      return false
    }

    let needsUpdate = false
    const updates: any = {}

    // Check and fix description
    if (listing.description && hasMojibake(listing.description)) {
      console.log(`Fixing description for ${listing.name}`)
      updates.description = fixMojibake(listing.description)
      needsUpdate = true
    }

    // Check and fix post_content
    if (listing.post_content && hasMojibake(listing.post_content)) {
      console.log(`Fixing post_content for ${listing.name}`)
      updates.post_content = fixMojibake(listing.post_content)
      needsUpdate = true
    }

    // Update if needed
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('escape_rooms')
        .update(updates)
        .eq('id', listingId)

      if (updateError) {
        console.error(`Error updating listing ${listingId}:`, updateError)
        return false
      }

      console.log(`✅ Fixed content for: ${listing.name}`)
      return true
    } else {
      console.log(`✅ No mojibake found in: ${listing.name}`)
      return true
    }

  } catch (error) {
    console.error(`Error processing listing ${listingId}:`, error)
    return false
  }
}

// Function to find all listings with mojibake
async function findListingsWithMojibake() {
  try {
    const { data: listings, error } = await supabase
      .from('escape_rooms')
      .select('id, name, description, post_content')
      .not('description', 'is', null)
      .or('post_content.not.is.null')

    if (error) {
      console.error('Error fetching listings:', error)
      return []
    }

    const listingsWithMojibake = listings?.filter(listing => 
      (listing.description && hasMojibake(listing.description)) ||
      (listing.post_content && hasMojibake(listing.post_content))
    ) || []

    console.log(`Found ${listingsWithMojibake.length} listings with mojibake`)
    return listingsWithMojibake

  } catch (error) {
    console.error('Error finding listings with mojibake:', error)
    return []
  }
}

// Main function to fix all listings
async function fixAllListings() {
  console.log('🔍 Finding listings with mojibake...')
  
  const listingsWithMojibake = await findListingsWithMojibake()
  
  if (listingsWithMojibake.length === 0) {
    console.log('✅ No listings with mojibake found!')
    return
  }

  console.log(`🔧 Fixing ${listingsWithMojibake.length} listings...`)
  
  let fixedCount = 0
  let errorCount = 0

  for (const listing of listingsWithMojibake) {
    const success = await fixListingContent(listing.id)
    if (success) {
      fixedCount++
    } else {
      errorCount++
    }
    
    // Add a small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n📊 Results:`)
  console.log(`✅ Fixed: ${fixedCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📝 Total processed: ${listingsWithMojibake.length}`)
}

// Export functions for individual use
export { fixListingContent, findListingsWithMojibake, fixMojibake, hasMojibake }

// Run if called directly
if (require.main === module) {
  fixAllListings()
    .then(() => {
      console.log('🎉 Content encoding fix completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error during content encoding fix:', error)
      process.exit(1)
    })
}
