import { supabase } from '../lib/supabase'

// Enhanced mojibake patterns with more comprehensive fixes
function fixMojibake(text: string): string {
  if (!text || typeof text !== 'string') return text

  // Common mojibake patterns and their fixes
  const fixes = [
    // Basic character fixes
    { pattern: /Ã¢â‚¬â€œ/g, replacement: '–' },
    { pattern: /Ã¢â‚¬â€/g, replacement: '—' },
    { pattern: /Ã¢â‚¬Å"/g, replacement: '"' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '"' },
    { pattern: /Ã¢â‚¬â„¢/g, replacement: "'" },
    { pattern: /Ã¢â‚¬â€°/g, replacement: "'" },
    { pattern: /Ã¢â‚¬Â¦/g, replacement: '…' },
    { pattern: /Ã¢â‚¬Â¢/g, replacement: '•' },
    
    // Additional common patterns
    { pattern: /ÃÂ¢ÃÃÃÃO/g, replacement: 'Great Escape' },
    { pattern: /Ã ÂÇÃOÂ Ã ÂOs/g, replacement: 'Butch Cassidy' },
    { pattern: /Ã¢â‚¬Å"([^"]*?)Ã¢â‚¬Â/g, replacement: '"$1"' },
    { pattern: /Ã¢â‚¬â„¢([^']*?)Ã¢â‚¬â€°/g, replacement: "'$1'" },
    
    // Fix common escape room terms
    { pattern: /Ã¢â‚¬Å"Escape RoomÃ¢â‚¬Â/g, replacement: '"Escape Room"' },
    { pattern: /Ã¢â‚¬Å"AdventureÃ¢â‚¬Â/g, replacement: '"Adventure"' },
    { pattern: /Ã¢â‚¬Å"PuzzleÃ¢â‚¬Â/g, replacement: '"Puzzle"' },
    { pattern: /Ã¢â‚¬Å"MysteryÃ¢â‚¬Â/g, replacement: '"Mystery"' },
    
    // Fix common words with apostrophes
    { pattern: /Ã¢â‚¬â„¢t/g, replacement: "'t" },
    { pattern: /Ã¢â‚¬â„¢s/g, replacement: "'s" },
    { pattern: /Ã¢â‚¬â„¢re/g, replacement: "'re" },
    { pattern: /Ã¢â‚¬â„¢ve/g, replacement: "'ve" },
    { pattern: /Ã¢â‚¬â„¢ll/g, replacement: "'ll" },
    { pattern: /Ã¢â‚¬â„¢d/g, replacement: "'d" },
    { pattern: /Ã¢â‚¬â„¢m/g, replacement: "'m" },
    
    // Fix common contractions
    { pattern: /donÃ¢â‚¬â„¢t/g, replacement: "don't" },
    { pattern: /wonÃ¢â‚¬â„¢t/g, replacement: "won't" },
    { pattern: /canÃ¢â‚¬â„¢t/g, replacement: "can't" },
    { pattern: /isnÃ¢â‚¬â„¢t/g, replacement: "isn't" },
    { pattern: /arenÃ¢â‚¬â„¢t/g, replacement: "aren't" },
    { pattern: /wasnÃ¢â‚¬â„¢t/g, replacement: "wasn't" },
    { pattern: /werenÃ¢â‚¬â„¢t/g, replacement: "weren't" },
    { pattern: /hasnÃ¢â‚¬â„¢t/g, replacement: "hasn't" },
    { pattern: /havenÃ¢â‚¬â„¢t/g, replacement: "haven't" },
    { pattern: /hadnÃ¢â‚¬â„¢t/g, replacement: "hadn't" },
    { pattern: /doesnÃ¢â‚¬â„¢t/g, replacement: "doesn't" },
    { pattern: /didnÃ¢â‚¬â„¢t/g, replacement: "didn't" },
    { pattern: /wouldnÃ¢â‚¬â„¢t/g, replacement: "wouldn't" },
    { pattern: /couldnÃ¢â‚¬â„¢t/g, replacement: "couldn't" },
    { pattern: /shouldnÃ¢â‚¬â„¢t/g, replacement: "shouldn't" },
    
    // Fix possessive forms
    { pattern: /([a-zA-Z])Ã¢â‚¬â„¢s/g, replacement: "$1's" },
    
    // Fix common punctuation
    { pattern: /Ã¢â‚¬Â¦/g, replacement: '…' },
    { pattern: /Ã¢â‚¬Â¢/g, replacement: '•' },
    { pattern: /Ã¢â‚¬â€œ/g, replacement: '–' },
    { pattern: /Ã¢â‚¬â€/g, replacement: '—' },
    
    // Clean up any remaining mojibake patterns
    { pattern: /Ã[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
    { pattern: /â‚¬[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
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

// Fast batch processing function
async function fixAllPostContent() {
  console.log('🔍 Starting comprehensive post_content fix...')
  
  try {
    // Get all records with post_content in batches
    let offset = 0
    const batchSize = 100
    let totalProcessed = 0
    let totalFixed = 0
    let totalErrors = 0

    while (true) {
      console.log(`📦 Processing batch starting at offset ${offset}...`)
      
      const { data: listings, error } = await supabase
        .from('escape_rooms')
        .select('id, name, post_content')
        .not('post_content', 'is', null)
        .range(offset, offset + batchSize - 1)

      if (error) {
        console.error('Error fetching listings:', error)
        break
      }

      if (!listings || listings.length === 0) {
        console.log('✅ No more listings to process')
        break
      }

      console.log(`📝 Processing ${listings.length} listings in this batch...`)

      // Process each listing in the batch
      for (const listing of listings) {
        try {
          if (listing.post_content && hasMojibake(listing.post_content)) {
            const fixedContent = fixMojibake(listing.post_content)
            
            const { error: updateError } = await supabase
              .from('escape_rooms')
              .update({ post_content: fixedContent })
              .eq('id', listing.id)

            if (updateError) {
              console.error(`❌ Error updating ${listing.name}:`, updateError)
              totalErrors++
            } else {
              console.log(`✅ Fixed: ${listing.name}`)
              totalFixed++
            }
          } else {
            console.log(`✅ Clean: ${listing.name}`)
          }
          
          totalProcessed++
        } catch (error) {
          console.error(`❌ Error processing ${listing.name}:`, error)
          totalErrors++
        }
      }

      offset += batchSize
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`\n📊 Final Results:`)
    console.log(`✅ Total processed: ${totalProcessed}`)
    console.log(`🔧 Total fixed: ${totalFixed}`)
    console.log(`❌ Total errors: ${totalErrors}`)
    
  } catch (error) {
    console.error('💥 Error during batch processing:', error)
  }
}

// Function to fix a single listing
async function fixSingleListing(listingId: string) {
  try {
    const { data: listing, error: fetchError } = await supabase
      .from('escape_rooms')
      .select('id, name, post_content')
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

    if (listing.post_content && hasMojibake(listing.post_content)) {
      const fixedContent = fixMojibake(listing.post_content)
      
      const { error: updateError } = await supabase
        .from('escape_rooms')
        .update({ post_content: fixedContent })
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

// Export functions
export { fixMojibake, hasMojibake, fixAllPostContent, fixSingleListing }

// Run if called directly
if (require.main === module) {
  fixAllPostContent()
    .then(() => {
      console.log('🎉 Enhanced content encoding fix completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error during enhanced content encoding fix:', error)
      process.exit(1)
    })
}
