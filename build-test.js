// Simple build test script
const { execSync } = require('child_process');

console.log('🔍 Checking for build issues...');

try {
  // Check TypeScript compilation
  console.log('📝 Checking TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed');

  // Check Next.js build
  console.log('🔨 Testing Next.js build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
