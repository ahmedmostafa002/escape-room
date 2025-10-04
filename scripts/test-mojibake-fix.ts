import { fixMojibake, hasMojibake } from './enhanced-content-fix'

// Test cases with common mojibake patterns
const testCases = [
  {
    input: "This is a test with Ã¢â‚¬â„¢apostrophesÃ¢â‚¬â€° and Ã¢â‚¬Å"quotesÃ¢â‚¬Â",
    expected: "This is a test with 'apostrophes' and \"quotes\""
  },
  {
    input: "DonÃ¢â‚¬â„¢t you think this is Ã¢â‚¬Å"amazingÃ¢â‚¬Â?",
    expected: "Don't you think this is \"amazing\"?"
  },
  {
    input: "The escape roomÃ¢â‚¬â„¢s theme is Ã¢â‚¬Å"mysteryÃ¢â‚¬Â",
    expected: "The escape room's theme is \"mystery\""
  },
  {
    input: "WeÃ¢â‚¬â„¢re going to have Ã¢â‚¬â€œ fun Ã¢â‚¬â€ in this room",
    expected: "We're going to have – fun — in this room"
  },
  {
    input: "This is a bullet point Ã¢â‚¬Â¢ with ellipsis Ã¢â‚¬Â¦",
    expected: "This is a bullet point • with ellipsis …"
  },
  {
    input: "Clean text without mojibake",
    expected: "Clean text without mojibake"
  }
]

console.log('🧪 Testing mojibake fix function...\n')

let passedTests = 0
let totalTests = testCases.length

testCases.forEach((testCase, index) => {
  const result = fixMojibake(testCase.input)
  const hasMojibakeInput = hasMojibake(testCase.input)
  const hasMojibakeResult = hasMojibake(result)
  const passed = result === testCase.expected
  
  console.log(`Test ${index + 1}:`)
  console.log(`  Input: "${testCase.input}"`)
  console.log(`  Expected: "${testCase.expected}"`)
  console.log(`  Got: "${result}"`)
  console.log(`  Has mojibake (input): ${hasMojibakeInput}`)
  console.log(`  Has mojibake (result): ${hasMojibakeResult}`)
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log('')
  
  if (passed) passedTests++
})

console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`)

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! The mojibake fix is working correctly.')
} else {
  console.log('⚠️  Some tests failed. Please check the patterns.')
}
