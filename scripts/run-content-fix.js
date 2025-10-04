// Simple script to run the content encoding fix
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting content encoding fix...\n');

// Run the TypeScript file
const scriptPath = path.join(__dirname, 'fix-content-encoding.ts');
const command = `npx tsx "${scriptPath}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running script:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️  Warnings:', stderr);
  }
  
  console.log(stdout);
  console.log('\n🎉 Content encoding fix completed!');
});
