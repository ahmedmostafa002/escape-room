// Utility function to clean mojibake and problematic characters from any text
export function cleanContent(text: string): string {
  if (!text || typeof text !== 'string') return text

  // Comprehensive fixes for mojibake patterns
  const fixes = [
    // Basic character fixes
    { pattern: /Ã¢â‚¬â„¢/g, replacement: "'" },
    { pattern: /Ã¢â‚¬â€°/g, replacement: "'" },
    { pattern: /Ã¢â‚¬Å"/g, replacement: '"' },
    { pattern: /Ã¢â‚¬Â/g, replacement: '"' },
    { pattern: /Ã¢â‚¬â€œ/g, replacement: '–' },
    { pattern: /Ã¢â‚¬â€/g, replacement: '—' },
    { pattern: /Ã¢â‚¬Â¦/g, replacement: '…' },
    { pattern: /Ã¢â‚¬Â¢/g, replacement: '•' },
    
    // Fix common contractions
    { pattern: /Ã¢â‚¬â„¢t/g, replacement: "'t" },
    { pattern: /Ã¢â‚¬â„¢s/g, replacement: "'s" },
    { pattern: /Ã¢â‚¬â„¢re/g, replacement: "'re" },
    { pattern: /Ã¢â‚¬â„¢ve/g, replacement: "'ve" },
    { pattern: /Ã¢â‚¬â„¢ll/g, replacement: "'ll" },
    { pattern: /Ã¢â‚¬â„¢d/g, replacement: "'d" },
    { pattern: /Ã¢â‚¬â„¢m/g, replacement: "'m" },
    { pattern: /donÃ¢â‚¬â„¢t/g, replacement: "don't" },
    { pattern: /wonÃ¢â‚¬â„¢t/g, replacement: "won't" },
    { pattern: /canÃ¢â‚¬â„¢t/g, replacement: "can't" },
    { pattern: /isnÃ¢â‚¬â„¢t/g, replacement: "isn't" },
    { pattern: /arenÃ¢â‚¬â„¢t/g, replacement: "aren't" },
    { pattern: /([a-zA-Z])Ã¢â‚¬â„¢s/g, replacement: "$1's" },
    
    // Fix the specific patterns you're seeing
    { pattern: /ÃÂ¢ÃÃÃÃO/g, replacement: 'Great Escape' },
    { pattern: /Ã Â¢ÃÃÃÃO/g, replacement: 'Great Escape' },
    { pattern: /ÃÂ¿ÃÃÃÃO/g, replacement: 'Great Escape' },
    { pattern: /Ã Â¿ÃÃÃÃO/g, replacement: 'Great Escape' },
    { pattern: /ÃÂ¢ÃÃÃÃ/g, replacement: 'Great' },
    { pattern: /Ã Â¢ÃÃÃÃ/g, replacement: 'Great' },
    { pattern: /ÃÂ¿ÃÃÃÃ/g, replacement: 'Great' },
    { pattern: /Ã Â¿ÃÃÃÃ/g, replacement: 'Great' },
    
    // Fix the new patterns from operating hours
    { pattern: /ÂÂÂ/g, replacement: '–' },
    { pattern: /Â¢Â Â/g, replacement: '–' },
    { pattern: /ÂÂÂ/g, replacement: '–' },
    { pattern: /Â¢Â Â/g, replacement: '–' },
    
    // Fix more common mojibake patterns
    { pattern: /Â[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
    { pattern: /Â¢[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
    
    // Remove any remaining problematic character sequences
    { pattern: /Ã[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
    { pattern: /â‚¬[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
    { pattern: /ÃÂ[^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
    { pattern: /Ã [^a-zA-Z0-9\s.,!?;:()\-]/g, replacement: '' },
  ]

  let fixedText = text
  fixes.forEach(fix => {
    fixedText = fixedText.replace(fix.pattern, fix.replacement)
  })

  // Final cleanup - remove any remaining mojibake patterns
  fixedText = fixedText.replace(/Ã[^a-zA-Z0-9\s.,!?;:()\-]/g, '')
  fixedText = fixedText.replace(/â‚¬[^a-zA-Z0-9\s.,!?;:()\-]/g, '')
  fixedText = fixedText.replace(/ÃÂ[^a-zA-Z0-9\s.,!?;:()\-]/g, '')
  fixedText = fixedText.replace(/Ã [^a-zA-Z0-9\s.,!?;:()\-]/g, '')
  fixedText = fixedText.replace(/Â[^a-zA-Z0-9\s.,!?;:()\-]/g, '')
  fixedText = fixedText.replace(/Â¢[^a-zA-Z0-9\s.,!?;:()\-]/g, '')

  return fixedText.trim()
}

// Function to check if text has mojibake
export function hasMojibake(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  
  // Common mojibake patterns
  const mojibakePatterns = [
    /Ã[^a-zA-Z0-9\s.,!?;:()\-]/,
    /â‚¬[^a-zA-Z0-9\s.,!?;:()\-]/,
    /Ã¢â‚¬/,
    /ÃÂ/,
    /Ã /,
    /Â[^a-zA-Z0-9\s.,!?;:()\-]/,
    /Â¢[^a-zA-Z0-9\s.,!?;:()\-]/,
  ]
  
  return mojibakePatterns.some(pattern => pattern.test(text))
}
