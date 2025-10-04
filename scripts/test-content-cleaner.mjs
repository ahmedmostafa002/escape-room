// Simple test for the content cleaner
import { cleanContent } from '../lib/content-cleaner.js';

// Test cases with the exact patterns you're seeing
const testCases = [
  {
    input: "This is a test with ÃÂ¿ÃÃÃÃO characters",
    expected: "This is a test with Great Escape characters"
  },
  {
    input: "ÃÂ¢ÃÃÃÃO is a great escape room",
    expected: "Great Escape is a great escape room"
  },
  {
    input: "Ã Â¢ÃÃÃÃO and ÃÂ¿ÃÃÃÃO are both problematic",
    expected: "Great Escape and Great Escape are both problematic"
  },
  {
    input: "Friday 11:30 AM ÂÂÂ 10:30 PM",
    expected: "Friday 11:30 AM – 10:30 PM"
  },
  {
    input: "Saturday 10:00 AM Â¢Â Â 10:30 PM",
    expected: "Saturday 10:00 AM – 10:30 PM"
  },
  {
    input: "Sunday 11:30 AM Â¢Â Â 5:30 PM",
    expected: "Sunday 11:30 AM – 5:30 PM"
  },
  {
    input: "Clean text without issues",
    expected: "Clean text without issues"
  }
];

console.log('🧪 Testing content cleaner...\n');

testCases.forEach((testCase, index) => {
  const result = cleanContent(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`Test ${index + 1}:`);
  console.log(`  Input: "${testCase.input}"`);
  console.log(`  Expected: "${testCase.expected}"`);
  console.log(`  Got: "${result}"`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('✅ Content cleaner test completed!');
